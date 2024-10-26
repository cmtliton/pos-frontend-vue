<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-delete"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="deleteBrand()"
        ></v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this Brand?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteBrandConfirm"
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
   import { useBrand } from '../../../stores';
   import { brandType } from '../../Types/productTypes';

   const Brand = useBrand()

   const dialogDelete = ref(false)

   let BrandFrmBrands = defineProps({
       brand: Object as PropType<brandType>
     })

   const deleteBrand = () => {
     Brand.editedBrand = Object.assign({}, BrandFrmBrands.brand)
     let index = Brand.brands.find((itm)=> itm.name?.toLocaleLowerCase() == Brand.editedBrand.name?.toLocaleLowerCase())
     if(index !== undefined) {
       Brand.editedIndex = Brand.brands.indexOf(index)
     }
      dialogDelete.value = true
   }
   const deleteBrandConfirm = () => {
       Brand.brands.splice(Brand.editedIndex, 1)
       Brand.deleteBrand(Brand.editedBrand.id)
       closeDelete()
   }

     function closeDelete () {
       dialogDelete.value = false
       nextTick(() => {
         Brand.editedBrand = Object.assign({}, Brand.defaultBrand)
         Brand.editedIndex = -1
       })
     }

     watch(dialogDelete, val => {
       val || closeDelete()
     })
</script>

