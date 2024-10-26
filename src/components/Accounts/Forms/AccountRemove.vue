<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-delete"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="deleteAccount()"
        ></v-btn>
      </template>

      <v-card>
        <v-card-title
          >Are you sure you want to delete this account?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >No</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteAccountConfirm"
            >Yes</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup lang="ts">
   import { ref, watch, nextTick, PropType } from 'vue'
   import { useAccount } from '../../../stores';
   import { accountType } from '../../Types/productTypes';

   const Account = useAccount()

   const dialogDelete = ref(false)

   let AccountFrmAccounts = defineProps({
       category: Object as PropType<accountType>
     })

   const deleteAccount = () => {
     Account.editedAccount = Object.assign({}, AccountFrmAccounts.category)
     let index = Account.Accounts.find((itm)=> itm.name?.toLocaleLowerCase() == Account.editedAccount.name?.toLocaleLowerCase())
     if(index !== undefined) {
       Account.editedIndex = Account.Accounts.indexOf(index)
     }
      dialogDelete.value = true
   }
   const deleteAccountConfirm = () => {
       Account.Accounts.splice(Account.editedIndex, 1)
       Account.deleteAccount(Account.editedAccount.id)
       closeDelete()
   }

     function closeDelete () {
       dialogDelete.value = false
       nextTick(() => {
         Account.editedAccount = Object.assign({}, Account.defaultAccount)
         Account.editedIndex = -1
       })
     }

     watch(dialogDelete, val => {
       val || closeDelete()
     })
</script>

