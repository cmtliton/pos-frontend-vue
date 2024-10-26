import { defineStore } from 'pinia'
import {ref, computed, nextTick, watch } from 'vue'
import { userType } from './../../components/Types/userTypes'
import useAuth from './../../composables/useAuth'
import axios from 'axios'


let { RetrieveUser, Login, Logout, CreateCompany, CreateUser, RetrieveUsers, UpdatedUser, UpdatingProfile } = useAuth()

export const useUser = defineStore('useUser', () => {

   /** State */

    const CompanyProfile = ref<userType[]>([])
    const users =ref<userType[]>([])
    const user = ref<userType>({})
    const authenticate = ref(false)
    const error = ref('Blank')
    const authErrors = ref<any>({username:[], mobileno:[], password:[]})
    const UserCreateDialog = ref(false)
    const UserUpdateDialog = ref(false)
    const roles = ref(['Admin', 'Manager', 'Sales', 'Purchase'])
    const editedUser = ref<userType>({})
    const defaultItem = ref<userType>({})
    const editedIndex = ref(-1)
    const formUserCreate = ref(false)
    const loadingUserCreate = ref(false)
    const visiblePassword = ref(false)
    const visibleConfirmPassword = ref(false)

   /**All Getters */

    const loggedIn = computed(() => {
        return authenticate.value
    })

     const getUser = computed(()=>{
        return user.value
     })

     const getUsers = computed(()=>{
        return users.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
     })

     const getError = computed(()=> {
        return error.value
     })

     const getAuthError = computed(()=> {
        return authErrors.value
     })
     const getRoles = computed(()=> {
        return roles.value
     })
     const rules = computed(()=>{
      return {
        required: (value:string) => !!value || 'Required',
        email: (value: string) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
          min: (v: string) => v.length >= 8 || 'Min 8 characters',
      }
     })

    const Fullname = computed(() => CompanyProfile.value.find((user) => user.id == getUser.value.company_id));
    const getCmpProfile = computed(() => CompanyProfile.value.filter((cmp) => cmp.id == getUser.value.company_id));
    const IsCmpLength = computed(() => CompanyProfile.value.length >= 1);

      /** All function  */
       async function LoadCmpProfile() {
        loadingUserCreate.value = true,
        await axios.get('/api/getCompanies')
        .then((res) => {
            CompanyProfile.value = res.data
        })
        loadingUserCreate.value = false
      }

      async function LoadUsers(cmpid: string) {
        await RetrieveUsers(cmpid)
      }

      async function CreateProfile(userProfile: userType) {
        CreateCompany(userProfile)
        
     }

     async function onCreateUser() {
        CreateUser({...editedUser.value, company_id: getUser.value.company_id, status: true})
     }

     async function UpdatingUser() {
      if(editedIndex.value> -1) {
         Object.assign(users.value[editedIndex.value], editedUser.value)
         await UpdatedUser(editedUser.value)
       }
    }

   async function ChangeStatusInUser(user: userType) {
      let UserIsFound = getUsers.value.find((itm)=>itm.id == user.id)
      if (user.id !== undefined && UserIsFound !== undefined) {
        UserIsFound.status =! user.status
        editedIndex.value = getUsers.value.indexOf(UserIsFound)
        editedUser.value = Object.assign({}, UserIsFound)
        UpdatingUser()
      }
     }

    async function onProfileUpdate() {
      if(editedIndex.value> -1) {
        Object.assign(CompanyProfile.value[editedIndex.value], editedUser.value)
        await UpdatingProfile(editedUser.value)
      }
    }

     async function onLogin(user: userType) {
       await Login(user)
     }

     async function onRetrieveUser() {
        await RetrieveUser()
     }

     async function onLogout () { 
        await Logout() 
    }

    function ClearUsernameAuthError() {
     authErrors.value.username = []
    }

    function ClearMobileNoAuthError() {
     authErrors.value.mobileno = []
    }

    function ClearPasswordAuthError() {
     authErrors.value.password = []
    }

    function close () {
      UserCreateDialog.value = false
      nextTick(()=>{
        editedUser.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
      })
    }

    function closeUpdateUserDialog () {
      UserUpdateDialog.value = false
      nextTick(()=>{
        editedUser.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
      })
      loadingUserCreate.value = false
    }

    watch(UserCreateDialog, val => {
      val || close()
    })

    watch(UserUpdateDialog, val => {
      val || closeUpdateUserDialog()
    })

     async function CheckUsername(user: userType) {
      let res = await axios.get(`/api/getUserByUsername/${user.username}`)
      authErrors.value.username = (res.data && res.data !== user.id) ? ['The username has already been taken.'] : []
     }

     async function CheckMobileno(user: userType) {
      let res = await axios.get(`/api/getUserByMobileno/${user.mobileno}`)
      authErrors.value.mobileno = (res.data && res.data !== user.id) ? ['The Mobile No. has already been taken.'] : []
     }

     async function MatchingPasswordConfirmation(username: userType) {
      authErrors.value.password = username.password === username.password_confirmation ? [] : ['','Password confirmation does not matched!']
    }

   
    return { 
        CompanyProfile, users, user, authenticate, error, authErrors, UserCreateDialog, UserUpdateDialog, 
        roles, loggedIn, getUser, getUsers, getError, getAuthError, getRoles, Fullname, getCmpProfile, IsCmpLength,
        editedUser, editedIndex, defaultItem, formUserCreate, loadingUserCreate, visiblePassword, visibleConfirmPassword, rules,
        LoadCmpProfile, LoadUsers, CreateProfile, onCreateUser, ChangeStatusInUser, onLogin, onRetrieveUser, onLogout, ClearUsernameAuthError, 
        ClearMobileNoAuthError, ClearPasswordAuthError, close, closeUpdateUserDialog, CheckUsername, CheckMobileno, MatchingPasswordConfirmation,
        UpdatingUser, onProfileUpdate,
    }
  })