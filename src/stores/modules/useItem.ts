
import { defineStore } from 'pinia'
import { itemType } from '../../components/Types/productTypes'
import { ref, computed, nextTick } from 'vue'
import axios, { AxiosError } from 'axios'
import { useUser } from './useUser'
import { useFlash } from '../../composables/flash'
import useAuth from '../../composables/useAuth'

let { getAuthtoken } =useAuth()

export const useItem = defineStore('useItem', () => {
    /** Item State */

    const items =ref<itemType[]>([])
    const editedItem = ref<itemType>({})
    const defaultItem = ref<itemType>({})
    const editedIndex = ref(-1)
    const itemErrors = ref<any>({name:[]})
    const ItemCreateDialog = ref(false)
    const ItemUpdateDialog = ref(false)
    const formItemCreate = ref(false)
    const loadingItemCreate = ref(false)

    /** Item Getters */

    const getItems = computed(()=>{
      return items.value.sort((b, a)=> (a.created_at !== undefined ? a.created_at : '') > (b.created_at !==undefined ? b.created_at : '')  ? 1 : -1)
    })

    const getItemById = computed(()=>{})

    const getItemErrors =computed(()=> {
      return itemErrors.value
    })

    const rules = computed(() => {
      return {
        required: (value:string) => !!value || 'Required',
      }
    })

    /** Item Actions */

    async function loadingItems(company_id: string | number | undefined) {
      await axios.get(`/api/getItemByCmpId/${company_id}/Company`, {
        headers: { 'authorization': getAuthtoken() }
      })
        .then((res) => {
            items.value = res.data
        })
        .catch((err:any) => {
          if (err instanceof AxiosError && err.response?.status === 500) {
          console.log(err.response.statusText)
          }
        })
    }

    async function creatingItem() {
      let User = useUser()
      if(editedIndex.value > -1) {
        /** ************************* Item Update **************** */
        try {
          loadingItemCreate.value = true
          await axios.put(`/api/updateItem/${editedItem.value.id}/update`, editedItem.value, {
            headers: { 'authorization': getAuthtoken() }
          })
          Object.assign(items.value[editedIndex.value], editedItem.value)
          closeUpdateItemDialog()
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
           }
        }
      } else {
        /** ************************* New Item Creation ******************* */
        try {
          loadingItemCreate.value = true
          let res = await axios.post('/api/createItem', {
            ...editedItem.value, status: true, company_id: User.getUser.company_id, 
            user_id: User.getUser.id
          }, {
            headers: { 'authorization': getAuthtoken() }
            })
            items.value.push(res.data.item)
            close()
        } catch (err) {
          if (err instanceof AxiosError && err.response?.status === 422) {
            console.log(err.response.data.errors)
          }
        }
      }
    }
    async function updatingItem() {}

    async function deleteItem(id: string | number| undefined) {
      let { flash } = useFlash()
      try {
        let res = await axios.get(`/api/deleteItem/${id}/delete`, {
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

    async function CheckItem(item: itemType) {
      itemErrors.value.name = (getItems.value.find((itm) => itm.name?.toLocaleLowerCase() == item.name?.toLocaleLowerCase())) !== undefined ? ['The item has already been taken.'] : []
    }

    function ClearItemNameError() {
      itemErrors.value.name = []
     }

     function ChangeStatusInItem(item: itemType) {
      let ItemIsFound = getItems.value.find((itm)=>itm.id == item.id)
      if (item.id !== undefined && ItemIsFound !== undefined) {
        ItemIsFound.status =! item.status
        editedIndex.value = getItems.value.indexOf(ItemIsFound)
        editedItem.value = Object.assign({}, ItemIsFound)
        creatingItem()
      }
     }

    function close() {
      ItemCreateDialog.value = false
      nextTick(()=>{
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
      })
      loadingItemCreate.value = false
    }

    function closeUpdateItemDialog() {
      ItemUpdateDialog.value = false
      nextTick(()=>{
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
      })
      loadingItemCreate.value = false
    }
  
    return { items, editedItem, editedIndex, defaultItem,itemErrors, ItemCreateDialog, ItemUpdateDialog,
      formItemCreate, loadingItemCreate, getItems, getItemById, getItemErrors, rules,
      loadingItems, creatingItem, updatingItem, deleteItem, CheckItem, ClearItemNameError, ChangeStatusInItem, close,
      closeUpdateItemDialog
     }
  })