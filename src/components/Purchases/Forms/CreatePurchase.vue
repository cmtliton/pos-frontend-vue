<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
  <v-sheet>
  <ProductList :products="useProduct().getProductsWithItemAndBrand" 
  @insert-in-cart="AddToCart"
  :isTransaction = false
  />
</v-sheet>
</v-col>
<v-col cols="auto">
<v-sheet class="mt-2">
  <cart/>
</v-sheet>
</v-col>
</v-row>
</v-container>
</template>

<script setup lang="ts">
  import ProductList from '../../Products/Forms/ProductList.vue'
  import { useProduct, usePurchase } from '../../../stores';
  import cart from './CartPurchase.vue';
  import { purchase_detailType } from '../../Types/productTypes';

  function AddToCart(product:any) {
    let product_for_purchase:purchase_detailType = {
      product_id: product.id,
      title: product.title,
      purchase_price: product.purchase_price,
      mrp: product.mrp,
      quantity: 1
    }
    usePurchase().AddInCart(product_for_purchase)
  }
</script>

<style scoped></style>
