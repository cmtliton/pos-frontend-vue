import {defineStore} from 'pinia'
import {ref, computed, nextTick } from 'vue'
import router from '../../router'
import axios, { AxiosError } from 'axios' 

import { sale_detailType, saleType, slnoType } from '../../components/Types/productTypes'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from './useUser'
import useAuth from '../../composables/useAuth'
import { useProduct } from './useProduct'
import { useFlash } from '../../composables/flash'
dayjs.extend(relativeTime);

let { getAuthtoken } =useAuth()

export const useInvoice = defineStore('useInvoice', ()=> {
    /** Define State */
    const Sales = ref<saleType[]>([])
    const SaleItems = ref<sale_detailType[]>([])
    const Stocks = ref<sale_detailType[]>([])

    const Cart =ref<saleType>({created_at: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')})
    const CartItems = ref<sale_detailType[]>([])
    const SlNos = ref<slnoType[]>([])
    const SlNosForSell = ref<slnoType[]>([]) /** Temporary Serial Number for Sell item */

    const itemsForDel = ref<number[]>([])

    const editedItem = ref<sale_detailType>({})
    const editedIndex = ref(-1)
    const SaleErrors = ref<any>({name:[], sale_price: [], mrp: [], measuring_unit: []})
    const loadingSaleCreate = ref(false)
    const formSaleCreate = ref(false)
    const dialogForUpdateSaleItem = ref(false)

    /** Define Getters */
    const getStockWithProduct = computed(() => {
      return Stocks.value.map((stk)=>{
        const product = useProduct().getProductsWithItemAndBrand.find((prd)=> stk.product_id === prd.id)
        return {
          ...stk,
          id: product?.id,
          brand_id: product?.brand_id,
          item_id: product?.item_id,
          title: product?.title,
          name: product?.name
        }
      })
    })
    const getSales = computed(()=> {
        return Sales.value
    })

    const getCart = computed(()=> {
        return Cart.value
    })

    const getCartItems = computed(()=>{
        const result = CartItems.value.map((itm: sale_detailType) => {
          return {
          id: itm.id,
          sale_id: itm.sale_id,
          inv: itm.sale_inv,
          product_id: itm.product_id,
          title: itm.title,
          purchase_price: itm.purchase_price,
          mrp: itm.mrp,
          quantity: itm.quantity,
          delivery_qty:itm.delivery_qty,
          stock_qty: itm.stock_qty === undefined ? 0 : itm.stock_qty,
          vat: itm.vat,
          vat_type: itm.vat_type,
          tax: itm.tax,
          tax_type: itm.tax_type,
          discount: itm.discount,
          disc_type: itm.disc_type,
          company_id: itm.company_id,
          unit_price: Number(itm.quantity === undefined ? 1 : itm.quantity) * Number(itm.mrp === undefined ? 1 : itm.mrp)
          }
  
        })
        return result
      })

      const CartTotalAmt = computed(()=> {
        return Cart.value.cart_total_amount = getCartItems.value.reduce((p, c) => p+Number(c.unit_price), 0)
     })
 
     const CartTotalQty = computed(()=> {
       return Cart.value.cart_total_quantity = getCartItems.value.reduce((p, c) => p+Number(c.quantity), 0)
     })

     const getSlNosForSell = computed(()=> {
      return SlNosForSell.value
     })
     const getSlNos = computed(()=> {
      return SlNos.value
    })

    /** *******************Action/Method/function *************** */
    async function loadingSales(company_id: string | number | undefined) {
        /* ********************************** Loading Sale ********************************** **/
        Sales.value = []
        loadingSaleCreate.value = true
        await axios.get(`/api/getSaleByCmpId/${company_id}/Sale`, {
          headers: { 'authorization': getAuthtoken() }
        })
          .then((res) => {
            for(let key in res.data){
              const Sale_info = {
                id: res.data[key].id,
                inv: res.data[key].inv,
                cart_total_quantity: res.data[key].cart_total_quantity,
                cart_total_amount: res.data[key].cart_total_amount,
                discount: res.data[key].discount,
                vat: res.data[key].vat,
                vat_type: res.data[key].vat_type,
                tax: res.data[key].tax,
                tax_type: res.data[key].tax_type,
                shipping: res.data[key].shipping,
                status: res.data[key].status,
                buyer_code: res.data[key].buyer_code,
                company_id: res.data[key].company_id,
                user_id: res.data[key].user_id,
                updator_id: res.data[key].updator_id,
                created_at: res.data[key].created_at,
                updated_at: res.data[key].updated_at,
                ...res.data[key].receivepayment
              }
            Sales.value.push(Sale_info)
            }           
          })
          .catch((err:any) => {
            if (err instanceof AxiosError && err.response?.status === 500) {
            console.log(err.response.statusText)
            }
          })
          await loadingSaleItems(company_id)
          loadingSaleCreate.value = false
      }

      async function loadingSaleItems(company_id: string | number | undefined) {
        /* ************************** Loading Sale Items ************ **/
        loadingSaleCreate.value = true
        await axios.get(`/api/getSaleByCmpId/${company_id}/SaleItems`, {
          headers: { 'authorization': getAuthtoken() }
        })
          .then((res) => {
              SaleItems.value = res.data
          })
          .catch((err:any) => {
            if (err instanceof AxiosError && err.response?.status === 500) {
            console.log(err.response.statusText)
            }
          })
          loadingSaleCreate.value = false
      }

      async function loadingStocks(company_id: string | number | undefined) {
        loadingSaleCreate.value = true
        await axios.get(`/api/getStocksByCmpId/${company_id}/Stock`, {
          headers: { 'authorization': getAuthtoken() }
        })
          .then((res) => {
              Stocks.value = res.data
          })
          .catch((err:any) => {
            if (err instanceof AxiosError && err.response?.status === 500) {
            console.log(err.response.statusText)
            }
          })
          loadingSaleCreate.value = false
      }

    async function initializingInvoice(){

        /** ************* Generate Invoice Number ***************** */
        EmptyCart()
        let $id = await axios.get(`/api/saleinitialize/${useUser().getUser.company_id}/`, {
          headers: {'authorization': getAuthtoken() }
      })
      Cart.value.inv = $id.data
      Cart.value.vat = 0,
      Cart.value.tax = 0,
      Cart.value.shipping = 0,
      Cart.value.discount = 0,
      Cart.value.company_id = useUser().getUser.company_id
      Cart.value.user_id = useUser().getUser.id
      Cart.value.updator_id = useUser().getUser.id
      Cart.value.created_at = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss') 
    }
    
    function AddInCart(product: any) {
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
            sale_id: getCart.value.id !== undefined ? getCart.value.id : '',
            sale_inv: getCart.value.inv,
            company_id: useUser().getUser.company_id
          })
          Cart.value.status = false
        }
    }

    function AddInCartBySlNo(product: any) { /** SlNos  */
      const index = SlNos.value.find((sl)=>sl.slno === product.slno)
      if(index !== undefined ) {
        /** ***********UPdate in SlNos********* */
        const i = SlNosForSell.value.indexOf(product)
        SlNosForSell.value.splice(i, 1)
        alert('Already Found in Cart!')
        return false     /** false = item will not be added */   
      } else {
        /** ************Push in SlNos ************** */
        SlNos.value.push(product)
        const i = SlNosForSell.value.indexOf(product)
        SlNosForSell.value.splice(i, 1)
        return true     /** true = item will be added in cart */
      }
    }

    async function getSlNosByProduct(product_id: Number | any){
      let productWithSlNos = await axios.get(`/api/getSlNosByProductId/${product_id}/Sell`, {
        headers: {'authorization': getAuthtoken() }
    })
    if(productWithSlNos.data.length>0) {
      SlNosForSell.value = productWithSlNos.data
      return true
    } else {
      SlNosForSell.value = []
      return false
    }
    }

    async function getProductBySlNo(SlNo: string){
      let productWithSlNos = await axios.get(`/api/getProductBySlNo/${SlNo}/Sell`, {
        headers: {'authorization': getAuthtoken() }
    })
     if(productWithSlNos.data !=='') {
      let product:any = getStockWithProduct.value.find((prd)=> prd.id === productWithSlNos.data.product_id)
      let product_for_sale = assignProduct(product)
      let isAddToCart = AddInCartBySlNo(productWithSlNos.data)
      isAddToCart == true ? AddInCart(product_for_sale) : null
     } else {
      useFlash().flash('', 'Product not found for sell!', 'warning')
     }
    
    }

    function assignProduct(product:sale_detailType) {
      return {
        product_id: product.id,
        title: product.title,
        discount:0,
        disc_type: 'Percentage',
        vat: 0,
        vat_type: 'I',
        tax: 0,
        tax_type: 'I',
        purchase_price: product.purchase_price,
        mrp: product.mrp,
        quantity: 1,
        delivery_qty: 0,
        stock_qty: product.stock_qty
      }
    }

    function SaveInvoice(){
        //
    }

    function UpdateInCart() {
        //
    }

    function editForCart(item: sale_detailType | any) {
        console.log(item)
    }

    function RemoveFromCart(product: sale_detailType | any) {
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
      let items = getSlNos.value.filter(item => item.company_id === product.company_id && item.product_id === product.product_id)
      for (let key in items) {
      let index = getSlNos.value.indexOf(items[key])
        SlNos.value.splice(index, 1)
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
        router.push('/Sales')
       }

    function close() {
        dialogForUpdateSaleItem.value = false
        nextTick(()=>{
          editedItem.value = Object.assign({}, {})
          editedIndex.value = -1
        })
        loadingSaleCreate.value = false
      }

    return {
        Sales, SaleItems, Cart, CartItems, SlNos, itemsForDel, editedItem, editedIndex, SaleErrors, loadingSaleCreate, formSaleCreate, dialogForUpdateSaleItem,
        getStockWithProduct, getSales, getCart, getCartItems, CartTotalAmt, CartTotalQty, getSlNosForSell,
        loadingSales, loadingSaleItems, loadingStocks, initializingInvoice, AddInCart, AddInCartBySlNo, getSlNosByProduct, getProductBySlNo, assignProduct, SaveInvoice, UpdateInCart, editForCart, RemoveFromCart, EmptyCart,
        close,
    }

})