<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-delete"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="deleteProduct()"
        ></v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this Product?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="deleteProductConfirm"
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
   import { useProduct } from '../../../stores';
   import { productType } from '../../Types/productTypes';

   const Product = useProduct()

   const dialogDelete = ref(false)

   let ProductFrmProducts = defineProps({
       product: Object as PropType<productType>
     })

   const deleteProduct = () => {
     let index = Product.Products.find((prd)=> prd.id === ProductFrmProducts.product?.id)
     Product.editedProduct = Object.assign({}, index)
     if(index !== undefined) {
       Product.editedIndex = Product.Products.indexOf(index)
     }
      dialogDelete.value = true
   }
   const deleteProductConfirm = () => {
       Product.Products.splice(Product.editedIndex, 1)
       Product.deleteProduct(Product.editedProduct.id)
       closeDelete()
   }

     function closeDelete () {
       dialogDelete.value = false
       nextTick(() => {
         Product.editedProduct = Object.assign({}, Product.defaultProduct)
         Product.editedIndex = -1
       })
     }

     watch(dialogDelete, val => {
       val || closeDelete()
     })
</script>

