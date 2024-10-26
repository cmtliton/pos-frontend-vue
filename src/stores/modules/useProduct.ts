
import { defineStore } from 'pinia'
import { productType, purchaseType } from '../../components/Types/productTypes'
import { ref, computed, nextTick } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser, useItem, useBrand, usePurchase } from '../'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'

let { getAuthtoken } =useAuth()

export const useProduct = defineStore('useProduct', () => {
    /** Product State */

    const Products =ref<productType[]>([])
    const editedProduct = ref<productType>({})
    const defaultProduct = ref<productType>({})
    const editedIndex = ref(-1)
    const ProductErrors = ref<any>({name:[], purchase_price: [], mrp: [], measuring_unit: []})
    const ProductCreateDialog = ref(false)
    const ProductUpdateDialog = ref(false)
    const formProductCreate = ref(false)
    const loadingProductCreate = ref(false)

    /** Product Getters */

    const getProducts = computed(()=>{
      return Products.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })
    const getProductsWithItemAndBrand = computed(()=> {
      return getProducts.value.map((prd) => {
        const item = useItem().getItems.find((itm) => itm.id === prd.item_id)
        const brand = useBrand().getBrands.find((brn) => brn.id === prd.brand_id)
        return {
          id: prd.id,
          item_id: item?.id,
          item_name: item?.name,
          brand_id: brand?.id,
          brand_name: brand?.name,
          title: item?.name + ' ' + brand?.name + ' ' + prd.name,
          name: prd.name,
          quantity: prd.quantity,
          purchase_price: prd.purchase_price,
          mrp: prd.mrp,
          status: prd.status,
          created_at: prd.created_at
        }
      })
    })
    const getProductById = computed(()=>{})

    const getProductErrors =computed(()=> {
      return ProductErrors.value
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required',
      }
    })

    /** Product Actions */

    async function loadingProducts(company_id: string | number | undefined) {
      loadingProductCreate.value = true
      await axios.get(`/api/getProductByCmpId/${company_id}/Product`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            Products.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
        loadingProductCreate.value = false
    }

    async function creatingProduct() {
      let User = useUser()
      if(editedIndex.value > -1) {
        /** ************************* Product Update **************** */
        try {
          loadingProductCreate.value = true
          let res = await axios.put(`/api/updateProduct/${editedProduct.value.id}/update`, {...editedProduct.value, updator_id: User.getUser.id}, {
            headers: { 'authorization': getAuthtoken() }
          })
          Object.assign(Products.value[editedIndex.value], editedProduct.value)
          closeUpdateProductDialog()
          useFlash().flash('Updated', res.data.message, 'success')
          
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            setProductError(err)
           }
        }
        loadingProductCreate.value = false
      } else {
        /** ************************* New Product Creation ******************* */
        try {
          loadingProductCreate.value = true
          let res = await axios.post('/api/createProduct', {
            ...editedProduct.value, status: true, company_id: User.getUser.company_id, 
            user_id: User.getUser.id
          }, {
            headers: { 'authorization': getAuthtoken() }
            })
            Products.value.push(res.data.Product)
            close()
            useFlash().flash('Saved', res.data.message, 'success')

            /** ********************Purchase Updated************* */
          if (res.data.PurchaseItems !== 0) {
            let cart: purchaseType = {
              id: res.data.PurchaseItems.purchase_id,
              PRN: res.data.PurchaseItems.PRN,
              cart_total_amount: Number(res.data.PurchaseItems.purchase_price)*Number(res.data.PurchaseItems.quantity),
              purchase_payment: Number(res.data.PurchaseItems.purchase_price)*Number(res.data.PurchaseItems.quantity),
              cart_total_quantity: res.data.PurchaseItems.quantity,
              company_id: res.data.PurchaseItems.company_id,
              status: true,
              user_id: res.data.Product.user_id,
              updator_id: User.getUser.id,
              created_at: res.data.PurchaseItems.created_at,
            }
          usePurchase().Purchases.push({...cart })
          usePurchase().PurchaseItems.push({...res.data.PurchaseItems})
          }
          
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
            setProductError(err)
            loadingProductCreate.value = false
          }
        }
        loadingProductCreate.value = false
      }
    }
    async function updatingProduct() {}

    async function deleteProduct(id: string | number| undefined) {
      let { flash } = useFlash()
      try {
        let res = await axios.get(`/api/deleteProduct/${id}/delete`, {
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

    async function CheckProduct(Product: productType) {
      ProductErrors.value.name = (getProducts.value.find((prd) => prd.name?.toLocaleLowerCase() == Product.name?.toLocaleLowerCase())) !== undefined ? ['The Product has already been taken.'] : []
    }

    function ClearProductNameError() {
      ProductErrors.value.name = []
     }
     function ClearProductPriceError() {
      ProductErrors.value.purchase_price = []
     }
     function ClearProductMrpError() {
      ProductErrors.value.mrp= []
     }

     function ClearProductMeasuringError() {
      ProductErrors.value.measuring_unit= []
     }

     function ChangeStatusInProduct(Product: productType) {
      let ProductIsFound = getProducts.value.find((itm)=>itm.id == Product.id)
      if (Product.id !== undefined && ProductIsFound !== undefined) {
        ProductIsFound.status =! Product.status
        editedIndex.value = getProducts.value.indexOf(ProductIsFound)
        editedProduct.value = Object.assign({}, ProductIsFound)
        creatingProduct()
      }
     }

    function close() {
      ProductCreateDialog.value = false
      nextTick(()=>{
        editedProduct.value = Object.assign({}, defaultProduct.value)
        editedIndex.value = -1
      })
      loadingProductCreate.value = false
    }

    function closeUpdateProductDialog() {
      ProductUpdateDialog.value = false
      nextTick(()=>{
        editedProduct.value = Object.assign({}, defaultProduct.value)
        editedIndex.value = -1
      })
      loadingProductCreate.value = false
    }

    function setProductError (err: any) {
      ProductErrors.value.name = err.response.data.errors.name ? err.response.data.errors.name : [];
      ProductErrors.value.purchase_price = err.response.data.errors.purchase_price ? err.response.data.errors.purchase_price : [];
      ProductErrors.value.mrp = err.response.data.errors.mrp ? err.response.data.errors.mrp : [];
      ProductErrors.value.measuring_unit = err.response.data.errors.measuring_unit ? err.response.data.errors.measuring_unit : [];
      
    }
  
    return { Products, editedProduct, editedIndex, defaultProduct,ProductErrors, ProductCreateDialog, ProductUpdateDialog,
      formProductCreate, loadingProductCreate, getProducts, getProductsWithItemAndBrand, getProductById, getProductErrors, rules,
      loadingProducts, creatingProduct, updatingProduct, deleteProduct, CheckProduct, ClearProductNameError, ClearProductPriceError, ClearProductMrpError, ClearProductMeasuringError, ChangeStatusInProduct, close,
      closeUpdateProductDialog, setProductError, 
     }
  })