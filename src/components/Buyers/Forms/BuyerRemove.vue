<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-delete"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="deleteBuyer()"
        ></v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this Buyer?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteBuyerConfirm"
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
   import { useBuyer } from '../../../stores';
   import { buyerType } from '../../Types/partyTypes';

   const Buyer = useBuyer()

   const dialogDelete = ref(false)

   let BuyerFrmBuyers = defineProps({
       Buyer: Object as PropType<buyerType>
     })

   const deleteBuyer = () => {
     Buyer.editedBuyer = Object.assign({}, BuyerFrmBuyers.Buyer)
     let index = Buyer.getBuyers.find((itm)=> itm.id == Buyer.editedBuyer.id)
     if(index !== undefined) {
       Buyer.editedIndex = Buyer.getBuyers.indexOf(index)
     }
      dialogDelete.value = true
   }
   const deleteBuyerConfirm = () => {
       Buyer.getBuyers.splice(Buyer.editedIndex, 1)
       Buyer.deleteBuyer(Buyer.editedBuyer.id)
       closeDelete()
   }

     function closeDelete () {
       dialogDelete.value = false
       nextTick(() => {
         Buyer.editedBuyer = Object.assign({}, Buyer.defaultBuyer)
         Buyer.editedIndex = -1
       })
     }

     watch(dialogDelete, val => {
       val || closeDelete()
     })
</script>

