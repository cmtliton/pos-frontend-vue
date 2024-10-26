<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-delete"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="deleteSupplier()"
        ></v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this Supplier?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteSupplierConfirm"
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
   import { useSupplier } from '../../../stores';
   import { supplierType } from '../../Types/partyTypes';

   const Supplier = useSupplier()

   const dialogDelete = ref(false)

   let SupplierFrmSuppliers = defineProps({
       supplier: Object as PropType<supplierType>
     })

   const deleteSupplier = () => {
     Supplier.editedSupplier = Object.assign({}, SupplierFrmSuppliers.supplier)
     let index = Supplier.getSuppliers.find((itm)=> itm.name?.toLocaleLowerCase() == Supplier.editedSupplier.name?.toLocaleLowerCase())
     if(index !== undefined) {
       Supplier.editedIndex = Supplier.getSuppliers.indexOf(index)
     }
      dialogDelete.value = true
   }
   const deleteSupplierConfirm = () => {
       Supplier.getSuppliers.splice(Supplier.editedIndex, 1)
       Supplier.deleteSupplier(Supplier.editedSupplier.id)
       closeDelete()
   }

     function closeDelete () {
       dialogDelete.value = false
       nextTick(() => {
         Supplier.editedSupplier = Object.assign({}, Supplier.defaultSupplier)
         Supplier.editedIndex = -1
       })
     }

     watch(dialogDelete, val => {
       val || closeDelete()
     })
</script>

