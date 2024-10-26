
import { defineStore } from 'pinia'
import { account_typeType, accountType } from '../../components/Types/productTypes'
import { ref, computed, nextTick } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser } from './useUser'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'

let { getAuthtoken } =useAuth()

export const useAccount = defineStore('useAccount', () => {
    /** Account State */

    const Accounts =ref<accountType[]>([])
    const Account_types = ref<account_typeType[]>([
      {id: 1, name: 'Current Asset', code: 'CA', description: '' },
      {id: 2, name: 'Fixed Asset', code: 'FA', description: '' },
      {id: 3, name: 'Current Liability', code: 'CL', description: '' },
      {id: 4, name: 'Fixed Liability', code: 'FL', description: '' },
      {id: 5, name: 'Income', code: 'I', description: '' },
      {id: 6, name: 'Fixed Expenses', code: 'FE', description: 'Rent, Salaries and Wages, Loan Payment' },
      {id: 7, name: 'Variable Expenses', code: 'VE', description: 'Raw materials, Labor, Utilities, Comm' },
      {id: 8, name: 'Operating Expenses', code: 'OE', description: '' },
      {id: 9, name: 'Non-operating Expenses', code: 'NOE', description: '' },
      {id: 10, name: 'Deposit', code: 'D', description: '' },
    ])
    const editedAccount = ref<accountType>({})
    const defaultAccount = ref<accountType>({})
    const editedIndex = ref(-1)
    const AccountErrors = ref<any>({name:[]})
    const AccountCreateDialog = ref(false)
    const AccountUpdateDialog = ref(false)
    const formAccountCreate = ref(false)
    const loadingAccountCreate = ref(false)

    /** Account Getters */

    const getAccounts = computed(()=>{
      return Accounts.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })

    const getAccountsWithType = computed(() => {
      return getAccounts.value.map((acc) => {
        const Type = getAccount_types.value.find((type) => type.id === acc.account_type_id)
        return {
          id: acc.id,
          name: acc.name,
          type_name: Type?.name,
          type_code: Type?.code,
          title: Type?.name + ' ' + acc.name,
          description: acc.description,
          account_type_id: Type?.id,
          status:acc.status,
          company_id: acc.company_id,
          user_id: acc.user_id,
          updator_id: acc.updator_id,
          created_at: acc.created_at,
          
        }
      })
    })

    const getAccount_types = computed(()=>{
      return Account_types.value
     })

    const getAccountById = computed(()=>{})

    const getAccountErrors =computed(()=> {
      return AccountErrors.value
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required',
      }
    })

    /** Account Actions */

    async function loadingAccounts(company_id: string | number | undefined) {
      //loadingAccount_Types()
      await axios.get(`/api/getAccountByCmpId/${company_id}/Account`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            Accounts.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
        loadingAccountCreate.value = false
    }

    /** ***************Loading account type types*************** */
    async function loadingAccount_Types() {
      loadingAccountCreate.value = true
      await axios.get(`/api/getAccount_Types`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            Account_types.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
    }

    async function creatingAccount() {
      let User = useUser()
      if(editedIndex.value > -1) {
        /** ************************* Account Update **************** */
        try {
          loadingAccountCreate.value = true
          await axios.put(`/api/updateAccount/${editedAccount.value.id}/update`, editedAccount.value, {
            headers: { 'authorization': getAuthtoken() }
          })
          Object.assign(Accounts.value[editedIndex.value], editedAccount.value)
          closeUpdateAccountDialog()
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
           }
        }
      } else {
        /** ************************* New Account Creation ******************* */
        try {
          loadingAccountCreate.value = true
          let res = await axios.post('/api/createAccount', {
            ...editedAccount.value, status: true, company_id: User.getUser.company_id, 
            user_id: User.getUser.id, updator_id: User.getUser.id
          }, {
            headers: { 'authorization': getAuthtoken() }
            })
            Accounts.value.push(res.data.Account)
            close()
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
          }
        }
      }
    }
    async function updatingAccount() {}

    async function deleteAccount(id: any) {
      let { flash } = useFlash()
      try {
        let res = await axios.get(`/api/deleteAccount/${id}/delete`, {
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

    async function CheckAccount(Account: accountType) {
      if(Account.name){
        let isFound = (getAccounts.value.find((itm)=> itm.name?.toLocaleLowerCase() == Account.name?.toLocaleLowerCase()))
        if(isFound !== undefined && isFound.id !== Account.id) {
          AccountErrors.value.name = ['The Account has already been taken.']
        } else {
          AccountErrors.value.name = []
        }
      } 
    }

    function ClearAccountNameError() {
      AccountErrors.value.name = []
     }

     function ChangeStatusInAccount(Account: accountType) {
      let AccountIsFound = getAccounts.value.find((itm)=>itm.id == Account.id)
      if (Account.id !== undefined && AccountIsFound !== undefined) {
        AccountIsFound.status =! Account.status
        editedIndex.value = getAccounts.value.indexOf(AccountIsFound)
        editedAccount.value = Object.assign({}, AccountIsFound)
        creatingAccount()
      }
     }

    function close() {
      AccountCreateDialog.value = false
      nextTick(()=>{
        editedAccount.value = Object.assign({}, defaultAccount.value)
        editedIndex.value = -1
      })
      loadingAccountCreate.value = false
    }

    function closeUpdateAccountDialog() {
      AccountUpdateDialog.value = false
      nextTick(()=>{
        editedAccount.value = Object.assign({}, defaultAccount.value)
        editedIndex.value = -1
      })
      loadingAccountCreate.value = false
    }
  
    return { Accounts, editedAccount, editedIndex, defaultAccount,AccountErrors, AccountCreateDialog, AccountUpdateDialog,
      formAccountCreate, loadingAccountCreate, getAccounts,getAccount_types, getAccountsWithType, getAccountById, getAccountErrors, rules,
      loadingAccounts, loadingAccount_Types, creatingAccount, updatingAccount, deleteAccount, CheckAccount, ClearAccountNameError, ChangeStatusInAccount, close,
      closeUpdateAccountDialog
     }
  })