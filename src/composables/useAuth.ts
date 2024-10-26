import axios, { AxiosError } from "axios";
import { userType } from "../components/Types/userTypes";
import { useUser, useItem, useSupplier, useBuyer, useProduct, usePurchase } from "../stores";
import { useFlash } from "./flash";
import router from "./../router"


export default function useAuth() {
  /* ******************Getting Authentication User************ **/
    const RetrieveUser = async() => {
   const User = useUser()
        try {
            let userData = await axios.get('/api/user', {
                headers: { 'authorization': getAuthtoken() }
            })
            User.authenticate = true
            User.user = userData.data
            await router.push('/')
        } catch (err: any) {
            User.error = 'Please Create Profile or Login!'
            User.authenticate = false
            User.user = {}
           await router.push('/SignIn')
           User.loadingUserCreate = false
        }
    }
 /* *********************User Login***************** **/
    const Login =(async(login: userType)=> {
        const User = useUser()
        User.loadingUserCreate = true
        await getToken()
        await axios.post('/api/login', {
            username: login.username,
            password: login.password
        })
        .then((res)=>{
            localStorage.setItem('Inventory_token', res.data.access_token)
            User.authenticate = true
            User.user = res.data.user
            router.push('/')
            User.loadingUserCreate = false
        })
        .catch((err)=>{
            if(err.response !== undefined){
            User.error = err.response.data.message
            router.push('/SignIn')
            User.loadingUserCreate = false
            }
        })
    })
/* *************** User Logout & User all Information make empty ********************* **/
    const Logout = async()=>{
        const User = useUser()
        const Item = useItem()
        const Supplier = useSupplier()
        const Buyer = useBuyer()
        await axios.get('/api/logout', {
            headers: { 'authorization': getAuthtoken() }
        })
        localStorage.removeItem('Inventory_token')
        User.authenticate = false
        User.user = {}   /** Reset Current User */
        User.users = []
        Item.items = []
        await router.push('/SignIn')
        Supplier.suppliers = []
        Buyer.Buyers = []
        useProduct().Products = []
        usePurchase().Purchases = []
        usePurchase().PurchaseItems = []
    }

    const getToken = async()=> {
        await axios.get('/sanctum/csrf-cookie')
     }
     /* ************Company Registration*************************** **/
     const CreateCompany = (async(userProfile: userType)=>{
        const User = useUser()
        await getToken()
        await axios.post('/api/createCompany', {
            ...userProfile,
            status: true,
        })
        .then((res =>{
            User.CompanyProfile.push(res.data)
            CreateUser({...userProfile, company_id: res.data.id, status: true, role: 'Admin'})
        }))
        .catch((err:any)=>{
            if (err instanceof AxiosError && err.response?.status === 422) {
            User.loadingUserCreate = false
            setAuthErrors(err)
            }
        })
     })
     /* **********New User Creation in Company************* **/

     const CreateUser = (async(userProfile: userType)=>{
        const User = useUser()
        let { flash } = useFlash()
        await getToken()
        try {
            User.loadingUserCreate = true
            const res = await axios.post('/api/newUser', userProfile)
            setDefaultAuthError()
            localStorage.setItem('Inventory_token', res.data.access_token)
            User.authenticate = true
            User.user = res.data.user
            User.users.push(res.data.user)
            User.loadingUserCreate = false
            User.close()
            await router.push('/Users');
            flash('Saving...','Profile has been Created!', 'success')
        } catch (err: any){
            if (err instanceof AxiosError && err.response?.status === 422) {
                User.loadingUserCreate = false 
                User.UserCreateDialog = true
                setAuthErrors(err)
            }
        } 
     })

     /** ******************Update Users******************* */
     const UpdatedUser = (async(userProfile: userType)=>{
        const User = useUser()
        let { flash } = useFlash()
        try {
            setDefaultAuthError()
            User.loadingUserCreate = true
            await getToken()
            await axios.put(`/api/UserUpdate/${userProfile.id}/edit`, userProfile, {
                headers: { 'authorization': getAuthtoken() },
            });
            User.closeUpdateUserDialog()
            flash('Updating...','Profile has been updated!', 'success')
            User.loadingUserCreate = false 
        } catch (err: any){
            if (err instanceof AxiosError && err.response?.status === 422) {
                User.loadingUserCreate = false 
                User.UserUpdateDialog = true
                setAuthErrors(err)
            }
        }
     })

     /** *********************Updating Company Profile************** */
     const UpdatingProfile=(async(CmpProfile: userType)=>{
        const User = useUser()
        let { flash } = useFlash()
        try {
            setDefaultAuthError()
            User.loadingUserCreate = true
            await getToken()
            await axios.put(`/api/CompanyUpdate/${CmpProfile.id}/edit`, CmpProfile, {
                headers: { 'authorization': getAuthtoken() },
            });
            User.closeUpdateUserDialog()
            flash('Updating...','Profile has been updated!', 'success')
            User.loadingUserCreate = false 
            await router.push('/Company');
        } catch (err: any){
            if (err instanceof AxiosError && err.response?.status === 422) {
                User.loadingUserCreate = false 
                User.UserUpdateDialog = true
                setAuthErrors(err)
            }
        }
     })

     /* ********************get Users by Compnay Id***************** **/

     const RetrieveUsers = (async(cmpid:string)=> {
        const User = useUser()
        await getToken()
        try {
          const response = await axios.get(`/api/users/${cmpid}`, {
            headers: { 'authorization': getAuthtoken() }
          });
          User.users = response.data
        } catch (error) {
          console.error(error)
        }
     })

/* **************Default Auth Error Set************* */
const setDefaultAuthError = (()=>{
    const User = useUser()
    User.authErrors = {username:[], mobileno:[], password:[]}
})

const setAuthErrors = (async(err:any)=>{
    const User = useUser()
    User.authErrors.username = err.response.data.errors.username ? err.response.data.errors.username : [];
    User.authErrors.password = err.response.data.errors.password ? err.response.data.errors.password : [];
    User.authErrors.mobileno = err.response.data.errors.mobileno ? err.response.data.errors.mobileno : [];
})

const getAuthtoken = (() =>{
    return 'Bearer ' + localStorage.getItem('Inventory_token')
})

return { 
    RetrieveUser, Login, Logout, CreateCompany, CreateUser,RetrieveUsers, 
    UpdatedUser, UpdatingProfile, getAuthtoken 
    }
}