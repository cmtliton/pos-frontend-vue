<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
  <v-card class="mx-auto">
    <v-data-table-virtual
    :headers="headers"
    :items="Sale.getStockWithProduct"
    height="600"
    item-value="name"
    :loading="Sale.loadingSaleCreate"
    density="compact"
  ></v-data-table-virtual>
  </v-card>
  </v-col>
  </v-row>
</v-container>
</template>

<script setup lang="ts">
  import { onMounted } from "vue"
  import { useInvoice, useProduct, useUser } from "../../../stores"; 

  const User = useUser()
  const Sale = useInvoice()

  const headers = [
    { title: 'Product Description', align: 'start', key: 'title' },
    { title: 'Quantity', align: 'end', key: 'stock_qty' },
    { title: 'Purchase Price', align: 'end', key: 'purchase_price' },
    { title: 'MRP', align: 'end', key: 'mrp' },
  ]

  
    onMounted(()=>{
      const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
      
      if(cmpid !== undefined && useProduct().getProducts.length<1) {
        useProduct().loadingProducts(cmpid)
        }

      if(cmpid !== undefined) {
        Sale.loadingStocks(cmpid)
      }
      
    })
</script>