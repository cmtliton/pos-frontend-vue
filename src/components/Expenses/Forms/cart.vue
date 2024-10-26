<template>
    <v-card>
      <v-card-subtitle>
        <div class="d-flex justify-start">
          <v-sheet class="mt-2 ml-2 pl-2">Purchase No: PRN20240401 </v-sheet>
          <v-sheet class="mt-2 ml-13 pl-6"> Purchase Date: 26.04.2024 </v-sheet>
          </div>
          <div class="d-flex justify-start mt-3">
            <v-autocomplete
              v-model.number="useSupplier().editedSupplier.id"
              :item-props="getSupplierByName"
              :items="useSupplier().getSuppliers"
              item-value="id"
              label="Select Supplier*"
              variant="outlined"
              required
              :rules="[useSupplier().rules.required]"
              density="compact"
              clearable
              auto-select-first
            ></v-autocomplete>
            <span> <supplier-create-in></supplier-create-in></span>
        </div>
        </v-card-subtitle>
        <v-divider></v-divider>
      <v-card-item>
        <v-table height="350px" density="compact" fixed-header>
          <thead>
            <tr>
              <th
                :class="[header.title === 'Product Description' ? 'text-left' : 'text-right']"
                v-for="(header, index) in PurchasesHeaders"
                :key="index"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in useProduct().getProductsWithItemAndBrand">
              <td>{{ product.title }}</td>
              <td class="text-right">{{ product.purchase_price }}</td>
              <td class="text-right">{{ product.quantity }}</td>
              <td class="text-right">
                {{ 10*10}}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th class="text-right">Purchase Total</th>
              <th></th>
              <th class="text-right">100</th>
              <th class="text-right">Tk.2000</th>
            </tr>
            <tr>
              <th></th>
              <th class="text-right">Payment</th>
              <th class="text-center">
                (<input type="text" maxlength="9" size="5" value="1200" />)
              </th>
              <th class="text-right">Tk.2000</th>
            </tr>
          </tfoot>
        </v-table>
      </v-card-item>
      <v-card-actions>
        <v-btn color="blue-darken-1" variant="text" @click=""> Cancel </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" type="submit"> Save </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useProduct, useSupplier } from '../../../stores';
  import { supplierType } from '../../Types/partyTypes';
  import SupplierCreateIn from '../../Suppliers/Forms/SupplierCreateIn.vue';

  const PurchasesHeaders = ref([
          {title: 'Product Description', key: 'title', align: 'left'},
          {title: 'Unit Price', key: 'purchase_price', align: 'right'},
          {title: 'Quantity', key: 'quantity', align: 'right'},
          {title: 'Unit Total', key: 'unit_total', align: 'right'}
        ])

  function getSupplierByName(item: supplierType) {
      return { title: item.name}
    }
</script>