<template>
<v-sheet>
  <ProductList :products="useProduct().getProductsWithItemAndBrand" />
</v-sheet>
<v-sheet class="mt-5 mr-15">
  <cart/>
</v-sheet>
</template>

<script setup lang="ts">
  import ProductList from '../../Products/Forms/ProductList.vue'
  import { useProduct } from '../../../stores';
  import cart from './cart.vue';

</script>