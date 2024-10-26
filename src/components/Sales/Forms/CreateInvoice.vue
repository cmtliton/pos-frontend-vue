<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-sheet>
          <ProductList
            :products="Invoice.getStockWithProduct"
            @insert-in-cart="AddToCart"
            :isTransaction="false"
          />
        </v-sheet>
      </v-col>
      <v-col cols="auto">
        <v-sheet class="mt-2">
          <cart />
        </v-sheet>
      </v-col>
    </v-row>
    <!-- ****************Dialog for getting Serial Number****************** -->
    <div class="text-center pa-4">
      <v-dialog v-model="SlDialog" width="auto">
        <v-card
          max-width="400"
          title="Select for adding cart..."
        >
        <v-divider></v-divider>
          <v-list density="compact" :lines="false" nav>
            <v-list-item
              :key="i"
              :value="item"
              color="primary"
              rounded="xl"
              v-for="(item, i) in Invoice.getSlNosForSell"
              @click="AddToCartBySlNo(item)"
            >
              <v-list-item-title v-text="item.slno"></v-list-item-title>
            </v-list-item>
          </v-list>
          <template v-slot:actions>
            <v-btn class="ms-auto" text="Ok" @click="SlDialog = false"></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import ProductList from '../../Products/Forms/ProductList.vue'
  import { useInvoice, useUser } from '../../../stores';
  import cart from './CartInvoice.vue';

  const Invoice = useInvoice()
  const User = useUser()

  let SlDialog = ref(false)

  async function AddToCart(product:any)
   {
    SlDialog.value = await Invoice.getSlNosByProduct(product.id) == true ? true : false
    let product_for_sale = Invoice.assignProduct(product)
    SlDialog.value === false ? Invoice.AddInCart(product_for_sale) : SlDialog.value = true
  }

  function AddToCartBySlNo(product:any) {
    let ProductJoin:any = Invoice.getStockWithProduct.find((prd)=>prd.id === product.product_id)
    let product_for_sale = Invoice.assignProduct(ProductJoin)
    let isCartUpdate = Invoice.AddInCartBySlNo(product)
    isCartUpdate == true ? Invoice.AddInCart(product_for_sale): null
    
  }

  onMounted(()=>{
    const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
    if(cmpid !== undefined) {
        Invoice.loadingStocks(cmpid)
      }
  })

</script>

<style scoped></style>
