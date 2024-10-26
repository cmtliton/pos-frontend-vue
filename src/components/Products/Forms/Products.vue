<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
          <v-card-title class="d-flex align-center pe-2">
            <span><ProductCreate></ProductCreate></span>

            <v-spacer></v-spacer>

            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              label="Search"
              single-line
              flat
              hide-details
              variant="solo-filled"
            ></v-text-field>
          </v-card-title>

          <v-divider></v-divider>
          <v-data-table
            :headers="ProductsHeaders"
            :items="Product.getProductsWithItemAndBrand"
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
            :loading="Product.loadingProductCreate"
            density="compact"
            height="400px"
            fixed-header
            v-model:search="search"
            Product-value="name"
            row
            justify-center
          >
            <template v-slot:item="{ item }">
              <tr :class="item.id%2 === 1 ? 'bg-grey-lighten-4' : 'bg-grey-lighten-5'">
                <td>{{item.item_name}}</td>
                <td>{{item.brand_name}}</td>
                <td>{{item.name}}</td>
                <td>{{useCurrency().currency(item.purchase_price)}}</td>
                <td>{{useCurrency().currency(item.mrp)}}</td>
                <td>Add/View Images</td>
                <td @click="Product.ChangeStatusInProduct(item)">
                  <span :class="item.status? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>{{dayjs(item.created_at).format('DD-MM-YYYY hh:mm A')}}</td>
                <td>
                <div class="d-flex justify-start">
                  <span><ProductUpdate :product="item"/></span>
                  <span>
                    <ProductRemove :product="item" />
                  </span>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue"
  import ProductCreate from "./ProductCreate.vue"
  import ProductUpdate from "./ProductUpdate.vue"
  import ProductRemove from "./ProductRemove.vue"
  import { useProduct, useUser } from './../../../stores'
  import { useCurrency } from "../../../composables/useCurrency"

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const Product = useProduct()

    const search = ref('')
      const ProductsHeaders = ref([
      { key: 'item_name', title: 'Item'},
      { key: 'brand_name', title: 'Brand' },
      { key: 'name', title: 'Product Name'},
      { key: 'purchase_price', title: 'Product Cost'},
      { key: 'mrp', title: 'Product Price'},
      { key: 'images', title: 'Images'},
      { key: 'status', title: 'Status' },
      { key: 'created_at', title: 'Created Date' },
      { key: 'Actions', title: 'Actions' }
      ])

    onMounted(()=> {
        const cmpid: string | undefined = useUser().getUser.company_id? useUser().getUser.company_id : useUser().user.company_id
       if(cmpid !== undefined && Product.getProducts.length<1) {
          Product.loadingProducts(cmpid)
        }
      })
</script>
