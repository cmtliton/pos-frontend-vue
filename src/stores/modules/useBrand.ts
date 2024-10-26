
import { defineStore } from 'pinia'
import { brandType } from '../../components/Types/productTypes'
import { ref, computed, nextTick } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser } from './useUser'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'

let { getAuthtoken } = useAuth()

export const useBrand = defineStore('useBrand', () => {
    /** Brand State */

    const brands =ref<brandType[]>([])
    const editedBrand = ref<brandType>({})
    const defaultBrand = ref<brandType>({})
    const editedIndex = ref(-1)
    const brandErrors = ref<any>({name:[]})
    const BrandCreateDialog = ref(false)
    const BrandUpdateDialog = ref(false)
    const formBrandCreate = ref(false)
    const loadingBrandCreate = ref(false)

    /** Brand Getters */

    const getBrands = computed(()=>{
      return brands.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })
    const getBrandById = computed(()=>{})

    const getBrandErrors =computed(()=> {
      return brandErrors.value
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required',
      }
    })

    /** Brand Actions */

    async function loadingBrands(company_id: string | number | undefined) {
      loadingBrandCreate.value = true
      await axios.get(`/api/getBrandByCmpId/${company_id}/Company`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            brands.value = res.data
            loadingBrandCreate.value = false
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
    }

    async function creatingBrand() {
      let User = useUser()
      if(editedIndex.value > -1) {
        /** ************************* Brand Update **************** */
        try {
          loadingBrandCreate.value = true
          await axios.put(`/api/updateBrand/${editedBrand.value.id}/update`, editedBrand.value, {
            headers: { 'authorization': getAuthtoken() }
          })
          Object.assign(brands.value[editedIndex.value], editedBrand.value)
          closeUpdateBrandDialog()
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
           }
        }
      } else {
        /** ************************* New Brand Creation ******************* */
        try {
          loadingBrandCreate.value = true
          let res = await axios.post('/api/createBrand', {
            ...editedBrand.value, status: true, company_id: User.getUser.company_id, 
            user_id: User.getUser.id
          }, {
            headers: { 'authorization': getAuthtoken() }
            })
            brands.value.push(res.data.brand)
            close()
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
          }
        }
      }
    }
    async function updatingBrand(brand: string |number | undefined) {
       ClearBrandNameError()
       BrandUpdateDialog.value = true
      let index = getBrands.value.find((itm)=> itm.id === brand)
      editedBrand.value = Object.assign({}, index)
      if(index !== undefined) {
        editedIndex.value = getBrands.value.indexOf(index)
      }
    }

    async function deleteBrand(id: string | number| undefined) {
      let { flash } = useFlash()
      try {
        let res = await axios.get(`/api/deleteBrand/${id}/delete`, {
          headers: { 'authorization': getAuthtoken() }
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

    async function CheckBrand(brand: brandType) {
      brandErrors.value.name = (getBrands.value.find((itm) => itm.name?.toLocaleLowerCase() == brand.name?.toLocaleLowerCase())) !== undefined ? ['The brand has already been taken.'] : []
    }

    function ClearBrandNameError() {
      brandErrors.value.name = []
     }

     function ChangeStatusInBrand(Brand: brandType) {
      let BrandIsFound = getBrands.value.find((brnd)=>brnd.id == Brand.id)
      if (Brand.id !== undefined && BrandIsFound !== undefined) {
        BrandIsFound.status =! Brand.status
        editedIndex.value = getBrands.value.indexOf(BrandIsFound)
        editedBrand.value = Object.assign({}, BrandIsFound)
        creatingBrand()
      }
     }

    function close() {
      BrandCreateDialog.value = false
      nextTick(()=>{
        editedBrand.value = Object.assign({}, defaultBrand.value)
        editedIndex.value = -1
      })
      loadingBrandCreate.value = false
    }

    function closeUpdateBrandDialog() {
      BrandUpdateDialog.value = false
      nextTick(()=>{
        editedBrand.value = Object.assign({}, defaultBrand.value)
        editedIndex.value = -1
      })
      loadingBrandCreate.value = false
    }
  
    return { brands, editedBrand, editedIndex, defaultBrand,brandErrors, BrandCreateDialog, BrandUpdateDialog,
      formBrandCreate, loadingBrandCreate, getBrands, getBrandById, getBrandErrors, rules,
      loadingBrands, creatingBrand, updatingBrand, deleteBrand, CheckBrand, ClearBrandNameError, ChangeStatusInBrand, close,
      closeUpdateBrandDialog
     }
  })