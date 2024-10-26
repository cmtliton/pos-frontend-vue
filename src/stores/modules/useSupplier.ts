
import { defineStore } from 'pinia'
import { supplierType } from '../../components/Types/partyTypes'
import { ref, computed, nextTick } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser } from './useUser'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'

let { getAuthtoken } = useAuth()

export const useSupplier = defineStore('useSupplier', () => {
    /** Supplier State */

    const suppliers =ref<supplierType[]>([])
    const editedSupplier = ref<supplierType>({})
    const defaultSupplier = ref<supplierType>({})
    const editedIndex = ref(-1)
    const SupplierErrors = ref<any>({name:[], mobileno:[]})
    const SupplierCreateDialog = ref(false)
    const SupplierUpdateDialog = ref(false)
    const formSupplierCreate = ref(false)
    const loadingSupplierCreate = ref(false)

    /** Supplier Getters */

    const getSuppliers = computed(()=>{
      return suppliers.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })
    const getSupplierById = computed(()=>{})

    const getSupplierErrors =computed(()=> {
      return SupplierErrors.value
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required'
      }
    })

    /** Supplier Actions */

    async function loadingSuppliers(company_id: string | number | undefined) {
        loadingSupplierCreate.value = true
      await axios.get(`/api/getSupplierByCmpId/${company_id}/Supplier`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            suppliers.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
        loadingSupplierCreate.value = false
    }

    async function creatingSupplier() {
      let User = useUser()
      if(editedIndex.value > -1 && getSupplierErrors.value.name[0] == undefined && getSupplierErrors.value.mobileno[0] == undefined) {
        /** ************************* Supplier Update **************** */
        try {
          loadingSupplierCreate.value = true
          await axios.put(`/api/updateSupplier/${editedSupplier.value.id}/update`, {...editedSupplier.value, updator_id: User.getUser.id}, {
            headers: { 'authorization': getAuthtoken() }
          })
          Object.assign(suppliers.value[editedIndex.value], editedSupplier.value)
          closeUpdateSupplierDialog()
        } catch (err) {
            loadingSupplierCreate.value = false
          if (err instanceof AxiosError && err.response?.status === 422) {
            SupplierErrors.value.mobileno = err.response.data.errors.mobileno ? err.response.data.errors.mobileno : [];
           }
        }
      } else {
        /** ************************* New Supplier Creation ******************* */
        try {
          loadingSupplierCreate.value = true
          let res = await axios.post('/api/createSupplier', {
            ...editedSupplier.value, status: true, company_id: User.getUser.company_id, 
            user_id: User.getUser.id
          }, { headers: {'authorization': getAuthtoken() }
            })
            suppliers.value.push(res.data.Supplier)
            close()
        } catch (err) {
            loadingSupplierCreate.value = false
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
          }
        }
      }
    }
    async function updatingSupplier() {}

    async function deleteSupplier(id: string | number| undefined) {
      let { flash } = useFlash()
      try {
        let res = await axios.get(`/api/deleteSupplier/${id}/delete`, {
            headers: {'authorization': getAuthtoken() }
        })
        flash('Deleted', res.data.message, 'info')
        console.log(res.data.message)
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          console.log(err.response.statusText)
          flash('Warning', err.response.statusText, 'warning')
        }
      }
    }

    async function CheckSupplier(Supplier: supplierType) {
      SupplierErrors.value.name = (getSuppliers.value.find((itm) => itm.name?.toLocaleLowerCase() == Supplier.name?.toLocaleLowerCase() && itm.id !== Supplier.id)) !== undefined ? ['The Supplier has already been taken.'] : []
    }

    async function CheckMobileno(Supplier: supplierType) {
        if(Supplier.mobileno !== undefined) {
          const User = useUser()
        let res = await axios.get(`/api/getSupplierByMobileno/${User.getUser.company_id}/${Supplier.mobileno}`, {
            headers: {'authorization': getAuthtoken() }
        })
        SupplierErrors.value.mobileno = (res.data && res.data !== Supplier.id) ? ['The Mobile No. has already been taken.'] : []
        }
       }

    function ClearSupplierNameError() {
      SupplierErrors.value.name = []
     }
    function ClearMobileNoError() {
    SupplierErrors.value.mobileno = []
    }

     function ChangeStatusInSupplier(Supplier: supplierType) {
      let SupplierIsFound = getSuppliers.value.find((itm)=>itm.id == Supplier.id)
      if (Supplier.id !== undefined && SupplierIsFound !== undefined) {
        SupplierIsFound.status =! Supplier.status
        editedIndex.value = getSuppliers.value.indexOf(SupplierIsFound)
        editedSupplier.value = Object.assign({}, SupplierIsFound)
        creatingSupplier()
      }
     }

    function close() {
      SupplierCreateDialog.value = false
      nextTick(()=>{
        editedSupplier.value = Object.assign({}, defaultSupplier.value)
        editedIndex.value = -1
      })
      loadingSupplierCreate.value = false
      ClearMobileNoError()
      ClearSupplierNameError()
    }

    function closeUpdateSupplierDialog() {
      SupplierUpdateDialog.value = false
      nextTick(()=>{
        editedSupplier.value = Object.assign({}, defaultSupplier.value)
        editedIndex.value = -1
      })
      loadingSupplierCreate.value = false
      ClearMobileNoError()
      ClearSupplierNameError()
    }

    async function initializePRN() {
      let $id = await axios.get(`/api/purchaseinitialize/${useUser().getUser.company_id}/`, {
        headers: {'authorization': getAuthtoken() }
    })
    console.log($id.data.PRN)
    }
  
    return { suppliers, editedSupplier, editedIndex, defaultSupplier,SupplierErrors, SupplierCreateDialog, SupplierUpdateDialog,
      formSupplierCreate, loadingSupplierCreate, getSuppliers, getSupplierById, getSupplierErrors, rules,
      loadingSuppliers, creatingSupplier, CheckMobileno, updatingSupplier, deleteSupplier, CheckSupplier, ClearSupplierNameError, ClearMobileNoError, ChangeStatusInSupplier, close,
      closeUpdateSupplierDialog, initializePRN
     }
  })