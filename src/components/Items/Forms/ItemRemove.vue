<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-delete"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="deleteItem()"
        ></v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup lang="ts">
   import { ref, watch, nextTick, PropType } from 'vue'
   import { useItem } from '../../../stores';
   import { itemType } from '../../Types/productTypes';

   const Item = useItem()

   const dialogDelete = ref(false)

   let itemFrmItems = defineProps({
       category: Object as PropType<itemType>
     })

   const deleteItem = () => {
     Item.editedItem = Object.assign({}, itemFrmItems.category)
     let index = Item.items.find((itm)=> itm.name?.toLocaleLowerCase() == Item.editedItem.name?.toLocaleLowerCase())
     if(index !== undefined) {
       Item.editedIndex = Item.items.indexOf(index)
     }
      dialogDelete.value = true
   }
   const deleteItemConfirm = () => {
       Item.items.splice(Item.editedIndex, 1)
       Item.deleteItem(Item.editedItem.id)
       closeDelete()
   }

     function closeDelete () {
       dialogDelete.value = false
       nextTick(() => {
         Item.editedItem = Object.assign({}, Item.defaultItem)
         Item.editedIndex = -1
       })
     }

     watch(dialogDelete, val => {
       val || closeDelete()
     })
</script>

