<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
  <v-sheet>
  <ProductList :products="useAccount().getAccountsWithType" 
  @insert-in-cart="AddToCart"
  :isTransaction = true
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
  import { useAccount, useLedger } from '../../../stores';
  import cart from './CartLedger.vue';
  import { ledgerType } from '../../Types/productTypes';

  function AddToCart(product:any) {
    let product_for_Ledger:ledgerType = {
      account_id: product.id,
      type_code: product.type_code,
      description: product.description,
      amount: 0,
      payment: 0
    }
    useLedger().AddInCart(product_for_Ledger)
  }
</script>

<style scoped></style>
