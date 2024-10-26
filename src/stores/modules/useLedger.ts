import { ledgerType } from './../../components/Types/productTypes';
import { useAccount } from './useAccount';

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser } from './useUser'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSupplier } from './useSupplier';
import router from '../../router';
import { useBuyer } from './useBuyer';
dayjs.extend(relativeTime);

let { getAuthtoken } =useAuth()

export const useLedger = defineStore('useLedger', () => {
    /** Ledger State */

    const Ledgers =ref<ledgerType[]>([])
    const Cart = ref<ledgerType>({})
    const JoinWithCart = ref<ledgerType>({})
    const editedLedger = ref<ledgerType>({})
    const editedIndex = ref(-1)
    const LedgerErrors = ref<any>({name:[]})
    const LedgerCreateDialog = ref(false)
    const LedgerUpdateDialog = ref(false)
    const formLedgerCreate = ref(false)
    const loadingLedgerCreate = ref(false)

    /** Ledger Getters */

    const getLedgers = computed(()=>{
      return Ledgers.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })
    const getLedgersWithAccountBySort = computed(()=> {
      return getLedgersWithAccount.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })
    const getLedgersWithAccount = computed(() => {
      return getLedgers.value.map((ledger:any) => {
        let Account = useAccount().getAccountsWithType.find((acc)=> acc.id === ledger.account_id)
        let Party = useSupplier().getSuppliers.find((supp) => supp.code === ledger.party_code) === undefined ? useBuyer().getBuyers.find((buyer) => buyer.code === ledger.party_code) : useSupplier().getSuppliers.find((supp) => supp.code === ledger.party_code)
        const user = useUser().getUsers.find((user) => user.id === ledger.user_id)
        const CmpName = useUser().getCmpProfile.find((cmpid)=> cmpid.id === ledger.company_id)
        return {
          id: ledger.id,
          account_id: Account?.id,
          TRN: ledger.TRN,
          type: ledger.type,
          created_at: ledger.created_at,
          updated_at: ledger.updated_at,
          account_name: Account?.name,
          type_name: Account?.type_name,
          type_code: Account?.type_code,
          description: ledger.description,
          amount: ledger.amount,
          ...ledger.receivepayment,
          party_code: ledger.party_code,
          party_name: Party?.name,
          party_mobile: Party?.mobileno,
          party_addr: Party?.addr,
          company_id: ledger.company_id,
          user_id: ledger.user_id,
          updator_id: ledger.updator_id,

          CmpName: CmpName?.name,
          CmpAddr: CmpName?.addr,
          CmpMobile: CmpName?.mobileno,
          username: user?.name
        }
      })
    })
    const getCart = computed(() => {
      return Cart.value
    })

    const getJoinWithCart = computed(() => {
      return JoinWithCart.value
    })

    const getCartWithAccount= computed(()=>{
      return useAccount().getAccountsWithType.find((acc)=>acc.id === getCart.value.account_id)
    })
    const getLedgerById = computed(()=>{})

    const getLedgerErrors =computed(()=> {
      return LedgerErrors.value
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required',
      }
    })

    const CheckAmount = computed(() => { /** this amount check with payment amount between transaction amount */
       if((getCart.value.amount == undefined? 0: getCart.value.amount)<(getCart.value.payment == undefined?0:getCart.value.payment)){
        return false
       } else {
        return true
       }
    })

    /** Ledger Actions */

    async function loadingLedgers(company_id: string | number | undefined) {
      loadingLedgerCreate.value = true
      await axios.get(`/api/getLedgerByCmpId/${company_id}/Ledger`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            Ledgers.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
      loadingLedgerCreate.value = false

    }

    async function initializeTRN() {
      let TRN = await axios.get(`/api/Ledgerinitialize/${useUser().getUser.company_id}/`, {
        headers: {'authorization': getAuthtoken() }
    })

    JoinWithCart.value.TRN = TRN.data
    JoinWithCart.value.company_id = useUser().getUser.company_id
    JoinWithCart.value.user_id = useUser().getUser.id
    JoinWithCart.value.updator_id = useUser().getUser.id
    JoinWithCart.value.created_at = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    JoinWithCart.value.updated_at = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    function AddInCart(item: ledgerType) {
      Cart.value = item
    }

    async function SaveLedger() {
      let SaveInformation = {
        ...getCart.value,
        ...getJoinWithCart.value
      }

      let receivepayment = {
        payment: getCart.value.payment
      }

      if(SaveInformation.id === undefined) {
        /*************New Transaction Creating ***************** */
        try {
          loadingLedgerCreate.value = true
          let res = await axios.post('/api/createLedger', {...SaveInformation}, {
            headers: { 'Authorization': getAuthtoken() }
          })
          
          let ledger:any = {
            ...res.data.Ledger,
            receivepayment
          }
          Ledgers.value.push(ledger)
          loadingLedgerCreate.value = false
          useFlash().flash('Save!','Transaction has been saved.', 'success')
          EmptyCart()
        } catch (error) {
          console.log(error)
        }
      } else {
        /** **********Transanction Updating****************/ 
        try {
          loadingLedgerCreate.value = true
         let res = await axios.put(`/api/updateLedger/${SaveInformation.id}/update`, { ...SaveInformation }, {
            headers: { 'authorization': getAuthtoken() },
          })

          let ledger:any = {
            ...SaveInformation,
            receivepayment
          }

          let index = getLedgers.value.find((trans) => trans.id === SaveInformation.id)
          editedIndex.value = getLedgers.value.indexOf(index !== undefined ? index : {})
          Object.assign(Ledgers.value[editedIndex.value], ledger)
          loadingLedgerCreate.value = false
          useFlash().flash('Update!', res.data.message, 'success')
          EmptyCart()
        } catch (error) {
          console.log(error)
        }
      }
      
    }
    function EmptyCart() {
      loadingLedgerCreate.value=false
      JoinWithCart.value = {
        created_at: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      }
      Cart.value = {}
      editedLedger.value = {}
      editedIndex.value = -1
      router.push('/Ledgers')
    }

    function loadLedgerInCart (item: ledgerType) {
      Cart.value.account_id = item.account_id,
      Cart.value.type_code = item.type_code,
      Cart.value.description = item.description,
      Cart.value.amount = item.amount,
      Cart.value.payment = item.payment,

      JoinWithCart.value.id = item.id,
      JoinWithCart.value.TRN = item.TRN,
      JoinWithCart.value.type = item.type,
      JoinWithCart.value.party_code = item.party_code,
      JoinWithCart.value.company_id = item.company_id,
      JoinWithCart.value.user_id = item.user_id,
      JoinWithCart.value.updator_id = useUser().getUser.id,
      JoinWithCart.value.created_at = dayjs(item.created_at).format('YYYY-MM-DDTHH:mm:ss'),
      JoinWithCart.value.updated_at = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    function updatingLedger(item: ledgerType) {
      console.log(item)
      loadLedgerInCart(item)
      router.push('/CreateLedger')
    }

    function confirmLedger(item: ledgerType) {console.log(item)}

    async function deleteLedger(id: Number) {
      loadingLedgerCreate.value = true
      try {
        let res = await axios.get(`/api/deleteLedger/${id}/delete`, {
          headers: { 'authorization': getAuthtoken() }
        })
        useFlash().flash('Deleted!', res.data.message, 'info')
        loadingLedgerCreate.value = false
        RemoveFromState(id)
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          useFlash().flash('Warning', err.response.statusText, 'warning')
        }
        loadingLedgerCreate.value = false
      }
    }

    function RemoveFromState(id:Number | any) {
      let Ledger = Ledgers.value.find((ledger)=> ledger.id === id)
      editedIndex.value = Ledgers.value.indexOf(Ledger !== undefined ? Ledger : {})
      Ledgers.value.splice(editedIndex.value, 1)
      editedIndex.value = -1
    }


  return {
    Ledgers, Cart, JoinWithCart, editedIndex, editedLedger, LedgerCreateDialog, LedgerUpdateDialog, formLedgerCreate, loadingLedgerCreate,
    getLedgers, getLedgersWithAccount,getLedgersWithAccountBySort, getLedgerById, getLedgerErrors, rules, CheckAmount, getCart, getJoinWithCart, getCartWithAccount,
    loadingLedgers, initializeTRN, AddInCart,SaveLedger, EmptyCart,updatingLedger, loadLedgerInCart, confirmLedger,deleteLedger,
     }
  })