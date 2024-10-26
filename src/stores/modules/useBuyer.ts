
import { defineStore } from 'pinia'
import { buyerType, type } from '../../components/Types/partyTypes'
import { ref, computed, nextTick } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser } from './useUser'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'

let { getAuthtoken } = useAuth()

export const useBuyer = defineStore('useBuyer', () => {
    /** Buyer State */

    const Buyers =ref<buyerType[]>([])
    const editedBuyer = ref<buyerType>({})
    const defaultBuyer = ref<buyerType>({})
    const editedIndex = ref(-1)
    const BuyerErrors = ref<any>({name:[], mobileno:[]})
    const BuyerCreateDialog = ref(false)
    const BuyerUpdateDialog = ref(false)
    const formBuyerCreate = ref(false)
    const loadingBuyerCreate = ref(false)
    const Types = ref<type[]>([
      { id: 1, name: 'Buyer', type: 'buyer'},
      { id: 2, name: 'Investor', type: 'investor'},
      { id: 3, name: 'Lender', type: 'lender'},
    ])

    /** Buyer Getters */

    const getBuyers = computed(()=>{
      return Buyers.value
    })

    const getBuyersWithTypes = computed(()=>{
      return getBuyers.value.map((buyer) =>{
        let type = getTypes.value.find((t)=>t.type === buyer.type)
        return {
          ...buyer,
          type:type?.type,
          title: type?.name
        }
      })
    })

    const getBuyersBySort = computed(()=>{
      return getBuyersWithTypes.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })
    const getBuyerById = computed(()=>{})

    const getBuyerErrors =computed(()=> {
      return BuyerErrors.value
    })

    const getTypes = computed(()=>{
      return Types.value
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required'
      }
    })

    /** Buyer Actions */

    async function loadingBuyers(company_id: string | number | undefined) {
        loadingBuyerCreate.value = true
      await axios.get(`/api/getBuyerByCmpId/${company_id}/Buyer`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            Buyers.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
        loadingBuyerCreate.value = false
    }

    async function creatingBuyer() {
      let User = useUser()
      if(editedIndex.value > -1 && getBuyerErrors.value.name[0] == undefined && getBuyerErrors.value.mobileno[0] == undefined) {
        /** ************************* Buyer Update **************** */
        try {
          loadingBuyerCreate.value = true
          await axios.put(`/api/updateBuyer/${editedBuyer.value.id}/update`, {...editedBuyer.value, updator_id: User.getUser.id}, {
            headers: { 'authorization': getAuthtoken() }
          })
          Object.assign(Buyers.value[editedIndex.value], editedBuyer.value)
          closeUpdateBuyerDialog()
        } catch (err) {
            loadingBuyerCreate.value = false
          if (err instanceof AxiosError && err.response?.status === 422) {
            BuyerErrors.value.mobileno = err.response.data.errors.mobileno ? err.response.data.errors.mobileno : [];
           }
        }
      } else {
        /** ************************* New Buyer Creation ******************* */
        try {
          loadingBuyerCreate.value = true
          let res = await axios.post('/api/createBuyer', {
            ...editedBuyer.value, status: true, company_id: User.getUser.company_id, 
            user_id: User.getUser.id
          }, { headers: {'authorization': getAuthtoken() }
            })
            Buyers.value.push(res.data.Buyer)
            close()
        } catch (err) {
            loadingBuyerCreate.value = false
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
          }
        }
      }
    }
    async function updatingBuyer() {}

    async function deleteBuyer(id: string | number| undefined) {
      let { flash } = useFlash()
      try {
        let res = await axios.get(`/api/deleteBuyer/${id}/delete`, {
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

    async function CheckBuyer(Buyer: buyerType) {
      BuyerErrors.value.name = (getBuyers.value.find((itm:buyerType) => itm.name?.toLocaleLowerCase() == Buyer.name?.toLocaleLowerCase() && itm.id !== Buyer.id)) !== undefined ? ['The Buyer has already been taken.'] : []
    }

    async function CheckMobileno(Buyer: buyerType) {
        if(Buyer.mobileno !== undefined) {
            const User = useUser()
          let res = await axios.get(`/api/getBuyerByMobileno/${User.getUser.company_id}/${Buyer.mobileno}`, {
              headers: {'authorization': getAuthtoken() }
          })
          BuyerErrors.value.mobileno = (res.data && res.data !== Buyer.id) ? ['The Mobile No. has already been taken.'] : []
          }
       }

    function ClearBuyerNameError() {
      BuyerErrors.value.name = []
     }
    function ClearMobileNoError() {
    BuyerErrors.value.mobileno = []
    }

     function ChangeStatusInBuyer(Buyer: buyerType) {
      let BuyerIsFound = Buyers.value.find((itm:buyerType)=>itm.id === Buyer.id)
      if (Buyer.id !== undefined && BuyerIsFound !== undefined) {
        BuyerIsFound.status =! Buyer.status
        editedIndex.value = Buyers.value.indexOf(BuyerIsFound)
        editedBuyer.value = Object.assign({}, BuyerIsFound)
        creatingBuyer()
      }
     }

    function close() {
      BuyerCreateDialog.value = false
      nextTick(()=>{
        editedBuyer.value = Object.assign({}, defaultBuyer.value)
        editedIndex.value = -1
      })
      loadingBuyerCreate.value = false
      ClearMobileNoError()
      ClearBuyerNameError()
    }

    function closeUpdateBuyerDialog() {
      BuyerUpdateDialog.value = false
      nextTick(()=>{
        editedBuyer.value = Object.assign({}, defaultBuyer.value)
        editedIndex.value = -1
      })
      loadingBuyerCreate.value = false
      ClearMobileNoError()
      ClearBuyerNameError()
    }
    function getTypeByName(item: type) {
      return { title: item.name}
    }
  
    return { Buyers, editedBuyer, editedIndex, defaultBuyer,BuyerErrors, BuyerCreateDialog, BuyerUpdateDialog,
      formBuyerCreate, loadingBuyerCreate, getBuyers, getBuyersBySort, getBuyerById, getBuyerErrors, rules, getTypes,
      loadingBuyers, creatingBuyer, CheckMobileno, updatingBuyer, deleteBuyer, CheckBuyer, ClearBuyerNameError, ClearMobileNoError, ChangeStatusInBuyer, close,
      closeUpdateBuyerDialog, getTypeByName
     }
  })