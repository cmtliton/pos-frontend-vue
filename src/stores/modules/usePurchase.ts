import { defineStore } from 'pinia'
import { purchaseType, purchase_detailType, slnoType } from '../../components/Types/productTypes'
import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser } from './useUser'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'
import router from '../../router'
import { useProduct } from './useProduct'
import { useSupplier } from './useSupplier'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);



let { getAuthtoken } =useAuth()

export const usePurchase = defineStore('usePurchase', () => {
    /** Purchase State */

    const Purchases = ref<purchaseType[]>([])
    const PurchaseItems = ref<purchase_detailType[]>([])

    const Cart =ref<purchaseType>({created_at: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')})
    const CartItems = ref<purchase_detailType[]>([])
    const SlNos = ref<slnoType[]>([])

    const itemsForDel = ref<number[]>([])

    const editedItem = ref<purchase_detailType>({})
    const editedIndex = ref(-1)
    const PurchaseErrors = ref<any>({name:[], purchase_price: [], mrp: [], measuring_unit: []})
    const loadingPurchaseCreate = ref(false)
    const formPurchaseCreate = ref(false)

    /** *****Purchase Getters********** */

    const getPurchaseById = computed(()=>{})

    const getPurchases = computed(()=> {
      return Purchases.value
    })

    const getPurchasesBySort = computed(()=> {
      return getPurchases.value //.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })

    const getPurchaseErrors =computed(()=> {
      return PurchaseErrors.value
    })

    const getCart = computed(() => {
      return Cart.value
    })

    const getCartWithCmpNameAndUsername = computed(() => {
      return useUser().getCmpProfile.map((cmpid)=> {
        const supplier = useSupplier().getSuppliers.find((supp)=> supp.code === getCart.value.supplier_code && supp.company_id === cmpid.id)
        const user = useUser().getUsers.find((user) => user.id === getCart.value.user_id && user.company_id === getCart.value.company_id)
        return {
          CmpName: cmpid.name,
          CmpAddr: cmpid.addr,
          CmpMobile: cmpid.mobileno,
          SuppName: supplier?.name,
          SuppAddr: supplier?.addr,
          SuppMobile: supplier?.mobileno,
          PRN: getCart.value.PRN,
          created_at: getCart.value.created_at,
          Userfullname: user?.name,
          cart_total_quantity: getCart.value.cart_total_quantity,
          cart_total_amount: getCart.value.cart_total_amount,
          purchase_payment: getCart.value.purchase_payment
        }
      })
    })

    
    const getCartItems = computed(()=>{
      const result = CartItems.value.map((itm: purchase_detailType) => {
        return {
        id: itm.id,
        purchase_id: itm.purchase_id,
        PRN: itm.PRN,
        product_id: itm.product_id,
        title: itm.title,
        purchase_price: itm.purchase_price,
        mrp: itm.mrp,
        quantity: itm.quantity,
        company_id: itm.company_id,
        unit_price: Number(itm.quantity === undefined ? 1 : itm.quantity) * Number(itm.purchase_price === undefined ? 1 : itm.purchase_price)
        }

      })
      return result
    })
    
    const getSlNos = computed(()=> {
      return SlNos.value
    })
    const filteredSlNos = computed(() => {
      return (product:any) => getSlNos.value.filter((sl) => sl.product_id === product.product_id && sl.purchasedetail_id === product.id)
    })
    const CartTotalAmt = computed(()=> {
       return Cart.value.cart_total_amount = getCartItems.value.reduce((p, c) => p+Number(c.unit_price), 0)
    })

    const CartTotalQty = computed(()=> {
      return Cart.value.cart_total_quantity = getCartItems.value.reduce((p, c) => p+Number(c.quantity), 0)
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required',
      }
    })

    /** Purchase Actions */

    async function loadingPurchases(company_id: string | number | undefined) {
      /* ********************************** Loading Purchase ********************************** **/
      Purchases.value = []
      loadingPurchaseCreate.value = true
      await axios.get(`/api/getPurchaseByCmpId/${company_id}/Purchase`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
          for(let key in res.data){
            const Purchase_info = {
              id: res.data[key].id,
              PRN: res.data[key].PRN,
              cart_total_quantity: res.data[key].cart_total_quantity,
              cart_total_amount: res.data[key].cart_total_amount,
              status: res.data[key].status,
              supplier_code: res.data[key].supplier_code,
              company_id: res.data[key].company_id,
              user_id: res.data[key].user_id,
              updator_id: res.data[key].updator_id,
              created_at: res.data[key].created_at,
              updated_at: res.data[key].updated_at,
              ...res.data[key].receivepayment
            }
          Purchases.value.push(Purchase_info)
          }           
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
        await loadingPurchaseItems(company_id)
        loadingPurchaseCreate.value = false
    }

    async function loadingPurchaseItems(company_id: string | number | undefined) {
      /* ************************** Loading Purchase Items ************ **/
      loadingPurchaseCreate.value = true
      await axios.get(`/api/getPurchaseByCmpId/${company_id}/PurchaseItems`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            PurchaseItems.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
        loadingPurchaseCreate.value = false
    }

    async function initializePRN() {
      /** **************** Create Purchase Invoice Number *************** */
      EmptyCart()
      let $id = await axios.get(`/api/purchaseinitialize/${useUser().getUser.company_id}/`, {
        headers: {'authorization': getAuthtoken() }
    })
    Cart.value.PRN = $id.data
    Cart.value.company_id = useUser().getUser.company_id
    Cart.value.user_id = useUser().getUser.id
    Cart.value.updator_id = useUser().getUser.id
    Cart.value.created_at = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    function AddInCart(product: purchase_detailType) {
      
      const index = getCartItems.value.find((itm) => itm.product_id == product.product_id)
      if(index !== undefined ) {
        /** ************ Cart Items Update *************************** */
        editedIndex.value = getCartItems.value.indexOf(index)
        CartItems.value[editedIndex.value].quantity = Number(CartItems.value[editedIndex.value].quantity) + Number(product.quantity)
        editedIndex.value = -1
      } else {
        /** *************Push Items ********************************** */
        CartItems.value.push({
          ...product,
          id: '',
          purchase_id: getCart.value.id !== undefined ? getCart.value.id : '',
          PRN: getCart.value.PRN,
          company_id: useUser().getUser.company_id
        })
        Cart.value.status = false
      }
     }
     
     function editForCart(product: any) {
      editedItem.value.company_id = product.company_id
      editedItem.value.id = product.id    /** purchasedetail_id */
      editedItem.value.product_id = product.product_id
      editedItem.value.purchase_price = product.purchase_price
      editedItem.value.quantity = product.quantity 
     }

     function UpdateInCart() { /** ********For Updating instant Cart Items */
      if(Number(editedItem.value.quantity) >= filteredSlNos.value(editedItem.value).length) {
      const index = getCartItems.value.find((itm) => itm.product_id === editedItem.value.product_id)
      if(index !== undefined) {
        editedIndex.value = getCartItems.value.indexOf(index)
        CartItems.value[editedIndex.value].purchase_price = Number(editedItem.value.purchase_price)
        CartItems.value[editedIndex.value].quantity = Number(editedItem.value.quantity)

        if(Number(CartItems.value[editedIndex.value].quantity) <=0 && editedItem.value.id =='') {
          CartItems.value.splice(editedIndex.value, 1)
        } else if(Number(CartItems.value[editedIndex.value].quantity) <= 0 && editedItem.value.id !=='') {
          itemsForDel.value.push(Number(CartItems.value[editedIndex.value].id))
          CartItems.value.splice(editedIndex.value, 1)
          RemoveFromSlNos(editedItem.value)
        } else {
          useFlash().flash('Success!', 'Item Updated!', 'success')
        }
        editedIndex.value = -1
      }
      editedItem.value = {}
      } else {
        useFlash().flash('Information!', 'Item not updated!!', 'info')
        editedItem.value = {}
      }
     }

     function EmptyCart() {
      Cart.value = {
        created_at: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      }
      CartItems.value = []
      itemsForDel.value = []
      editedItem.value = {}
      editedIndex.value = -1
      SlNos.value = []
      router.push('/Purchases')
     }

     function RemoveFromCart(product:any) {
      const index = getCartItems.value.find((itm) => itm.product_id === product.product_id)
      if(index !== undefined && index.id == '') {
        editedIndex.value = getCartItems.value.indexOf(index)
        CartItems.value.splice(editedIndex.value, 1)
        RemoveFromSlNos(product)
      } else if (index !== undefined && index.id !== '') {
        editedIndex.value = getCartItems.value.indexOf(index)
        RemoveFromSlNos(product)
        CartItems.value.splice(editedIndex.value, 1)
        itemsForDel.value.push(product.id) /** this item will be deleted when cart item will be updated */
      } else {
        alert('Select Item for delete!')
      }
    }

    function RemoveFromSlNos(product:any) {
      let items = getSlNos.value.filter(item => item.company_id === product.company_id && item.purchasedetail_id ===product.id && item.product_id === product.product_id)
      for (let key in items) {
      let index = getSlNos.value.indexOf(items[key])
        SlNos.value.splice(index, 1)
      }
    }

    async function SavePurchase() {
      loadingPurchaseCreate.value = true
      let purchaseinfo = {
        id:getCart.value.id,
        PRN: getCart.value.PRN,
        cart_total_amount: getCart.value.cart_total_amount,
        cart_total_quantity: getCart.value.cart_total_quantity,
        purchase_payment: getCart.value.purchase_payment,
        status: getCart.value.status,
        company_id: getCart.value.company_id,
        user_id: getCart.value.user_id,
        updator_id: getCart.value.updator_id,
        supplier_code: getCart.value.supplier_code,
        created_at: getCart.value.created_at,
        updated_at: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
        
        purchases: getCartItems.value,
        slnos: getSlNos.value,
        itemsForDel: itemsForDel.value,
      }
      if(getCart.value && getCartItems.value.length>=1 && getCart.value.id === undefined) {
        /** ******************** Create New Purchase save in database **************** */
       try {
        let res = await axios.post('/api/createPurchase', {...purchaseinfo }, {
          headers: { 'authorization': getAuthtoken() }
          })
          let PurchWithPayment = {
            ...res.data.Purchase,
            purchase_payment: res.data.purchase_payment
          }
          Purchases.value.push(PurchWithPayment)
          for(let i = 0 ; i<res.data.PurchaseItems.length; i++) { /** for (let key in []) {} */
            PurchaseItems.value.push(res.data.PurchaseItems[i])
          }
        
        useFlash().flash('Purchase', res.data.message, 'success')
        loadingPurchaseCreate.value = false
        EmptyCart()
       } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 422) {
          console.log(err.response.data.errors)
          setPurchaseError(err)
          loadingPurchaseCreate.value = false
        }
        }
      } else if (getCart.value && getCartItems.value.length>=1 && getCart.value.id !== undefined) {
        /** ******************** Purchase Update in database **************** */
        if(itemsForDel.value.length>0) {
          for(let i = 0 ; i<itemsForDel.value.length; i++) {
            let delete_index = PurchaseItems.value.find((itm) => Number(itm.id) === itemsForDel.value[i])
            PurchaseItems.value.splice(PurchaseItems.value.indexOf(delete_index !== undefined ? delete_index: {}), 1)
          }
        }
        try {
        let res = await axios.put(`/api/updatePurchase/${purchaseinfo.id}/update`, { ...purchaseinfo }, {
            headers: { 'authorization': getAuthtoken() },
          })
/** *********************Purchases State Update************** */
          let index = getPurchases.value.find((pur) => pur.id === purchaseinfo.id)
          editedIndex.value = Purchases.value.indexOf(index !== undefined ? index :{})
          console.log(editedIndex.value)
          Object.assign(Purchases.value[editedIndex.value], getCart.value)
          editedIndex.value = -1
/** *******************PurchaseItems State Update******************************** */

          for(let i = 0 ; i<res.data.PurchaseItems.length; i++) { /** for (let key in []) {} */
          let item_index = PurchaseItems.value.find((itm) => itm.id === getCartItems.value[i].id)
          if (item_index !== undefined && getCartItems.value[i].id !== '') {
            editedIndex.value = PurchaseItems.value.indexOf(item_index)
            Object.assign(PurchaseItems.value[editedIndex.value], getCartItems.value[i])
            editedIndex.value = -1
          } else if(getCartItems.value[i].id == '') {
            PurchaseItems.value.push(res.data.PurchaseItems[i])
          }
          }
/** **********************End*********************************************** */
        useFlash().flash('Purchase', res.data.message, 'success')
        loadingPurchaseCreate.value = false
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            setPurchaseError(err)
            loadingPurchaseCreate.value = false
          }
        }
      } else {
        useFlash().flash('','Please Add few product to purchase!', 'info')
        loadingPurchaseCreate.value = false
      }
      loadingPurchaseCreate.value = false
      EmptyCart()
    }

    function updatingPurchase(item:purchaseType) {
      console.log(item)
      EmptyCart()
      if(Number(item.status) === 0) {
      PurchasedInfoById(item)
      Cart.value.status = false
      router.push('/CreatePurchase')
      } else {
        useFlash().flash('Warning', 'Purchase can not be updated!', 'warning')
      }
      
    }

    async function confirmPurchase(item: purchaseType) {
      EmptyCart()
      if(Number(item.status) === 1 && await isPurchaseDeletable(item) === 1) {
        PurchasedInfoById(item)
        Cart.value.status = true
        router.push('/CreatePurchase')
      } else if(Number(item.status) === 0){
        PurchasedInfoById(item)
        Cart.value.status = true
        router.push('/CreatePurchase')
      } else {
        useFlash().flash('Warning', 'Purchase can not be updated!', 'warning')
      }
    }

    async function DeletePurchase(item: purchaseType) {
      if(Number(item.status) === 0) {
        Delete(Number(item.id))
       } else if(Number(item.status) === 1 && await(isPurchaseDeletable(item)) === 1) {
        Delete(Number(item.id))
        } else {
          useFlash().flash('Warning', 'Purchase can not be deleted!', 'warning')
        }
    }

    async function Delete (id: Number) {
    loadingPurchaseCreate.value = true
      try {
        let res = await axios.get(`/api/deletePurchase/${id}/delete`, {
          headers: { 'authorization': getAuthtoken() }
        })
        useFlash().flash('Deleted', res.data.message, 'info')
        loadingPurchaseCreate.value = false
        RemovePurchase(id)
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          useFlash().flash('Warning', err.response.statusText, 'warning')
        }
        loadingPurchaseCreate.value = false
      }
    }
    
  function RemovePurchase(id: Number) {
    let Purchase = Purchases.value.find((Purch)=> Number(Purch.id) === id)
    editedIndex.value = Purchases.value.indexOf(Purchase !== undefined ? Purchase : {})
    Purchases.value.splice(editedIndex.value, 1)
    editedIndex.value = -1

    let getPurItems = PurchaseItems.value.filter((purchase) => Number(purchase.purchase_id ) === id)
    for(let i = 0 ; i<getPurItems.length; i++) { /** for (let key in []) {} */ 
      let index = PurchaseItems.value.find(itm=> itm.id === getPurItems[i].id)
      editedIndex.value = PurchaseItems.value.indexOf(index !== undefined ? index : {})
      PurchaseItems.value.splice(editedIndex.value, 1)
      editedIndex.value= -1
    }
    
  }
    function PurchasedInfoById(item: purchaseType) {
      let getPurItems = PurchaseItems.value.filter((purchase) => purchase.purchase_id === item.id)
      let items = getPurItems.map((itm)=>{
      let filteredProduct = useProduct().getProductsWithItemAndBrand.find((prd) => prd.id == itm.product_id)
        
       return {
        id: itm.id,
        purchase_id: item.id,
        PRN: item.PRN,
        product_id: filteredProduct?.id,
        title: filteredProduct?.title,
        purchase_price: itm.purchase_price,
        mrp: filteredProduct?.mrp,
        quantity: itm.quantity,
        company_id: item.company_id,
       }
      })
      CartItems.value = items
      Cart.value = {
        id: item.id,
        PRN: item.PRN,
        cart_total_quantity: item.cart_total_quantity,
        cart_total_amount: item.cart_total_amount,
        purchase_payment: Number(item.purchase_payment),
        supplier_code: item.supplier_code,
        created_at: dayjs(item.created_at).format('YYYY-MM-DDTHH:mm:ss'),
        updated_at: item.updated_at,
        user_id: item.user_id,
        updator_id: useUser().getUser.id,
        status: item.status,
        company_id: item.company_id

      }
      getSlNosById(items)
    }

    async function getSlNosById(items: any) {
      loadingPurchaseCreate.value = true
      const slnos = []
      for(let key in items) {
      slnos.push({
          company_id : items[key].company_id,
          purchasedetail_id: items[key].id,
          product_id: items[key].product_id
      })
      }
      const ItemSlnos = { slnos: slnos}
      try {
        let res = await axios.post('/api/getSlNosById/Purchased', {...ItemSlnos }, {
          headers: { 'authorization': getAuthtoken() }
          })
          res.data.slnos.length > 0 ? SlNos.value = res.data.slnos : SlNos.value = []
          loadingPurchaseCreate.value = false
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 422) {
          console.log(err.response.data.errors)
          setPurchaseError(err)
          loadingPurchaseCreate.value = false
        }
      }
      
      loadingPurchaseCreate.value = false
    }

    async function isPurchaseDeletable(item: purchaseType) {
      loadingPurchaseCreate.value = true
     try {
      let res = await axios.get(`/api/checkStockForPurchaseDelete/${item.company_id}/${item.id}/${item.cart_total_quantity}`, {
        headers: { 'authorization': getAuthtoken() }
      })
      loadingPurchaseCreate.value = false
      return res.data
     } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        useFlash().flash('Warning', err.response.statusText, 'warning')
      }
      loadingPurchaseCreate.value = false
     }
    }

    function ClearPurchaseNameError() {
      PurchaseErrors.value.name = []
     }
     function ClearPurchasePriceError() {
      PurchaseErrors.value.purchase_price = []
     }
     function ClearPurchaseMrpError() {
      PurchaseErrors.value.mrp= []
     }

     function ClearPurchaseMeasuringError() {
      PurchaseErrors.value.measuring_unit= []
     }

     
    function setPurchaseError (err: any) {
      PurchaseErrors.value.name = err.response.data.errors.Purchase_name ? err.response.data.errors.Purchase_name : [];
      PurchaseErrors.value.purchase_price = err.response.data.errors.purchase_price ? err.response.data.errors.purchase_price : [];
      PurchaseErrors.value.mrp = err.response.data.errors.mrp ? err.response.data.errors.mrp : [];
      PurchaseErrors.value.measuring_unit = err.response.data.errors.measuring_unit ? err.response.data.errors.measuring_unit : [];
      
    }
  
    return { Purchases, PurchaseItems, Cart, CartItems, SlNos,itemsForDel, editedItem, editedIndex, PurchaseErrors, loadingPurchaseCreate, formPurchaseCreate,
      getPurchaseById, getPurchases, getPurchasesBySort, getPurchaseErrors, rules, filteredSlNos, getCart, getCartItems, 
      CartTotalAmt, CartTotalQty, getSlNos, getCartWithCmpNameAndUsername,
      loadingPurchases, loadingPurchaseItems, RemoveFromCart, confirmPurchase, PurchasedInfoById, SavePurchase, updatingPurchase, DeletePurchase, AddInCart, EmptyCart,
      ClearPurchaseNameError, ClearPurchasePriceError, ClearPurchaseMrpError, editForCart, UpdateInCart,
    ClearPurchaseMeasuringError, close, setPurchaseError, initializePRN,
     }
  })