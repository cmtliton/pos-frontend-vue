<template>
  <v-card class="mx-auto">
    <v-form class="mx-auto" v-model="Sale.formSaleCreate" @submit.prevent="Sale.SaveInvoice()">
    <v-card-subtitle>
      <div class="d-flex justify-start bg-blue-lighten-1">
        <v-sheet class="ma-2 bg-blue-lighten-1"
          >Invoice No: {{Sale.getCart.inv}}</v-sheet
        >
        <v-sheet class="mt-2 bg-blue-lighten-1"
          >Date:
        <input type="datetime-local" v-model="Sale.Cart.created_at"/>
        
      </v-sheet>
      </div>
      <div class="d-flex justify-start mt-3">
        <v-autocomplete
          v-model.number="Sale.Cart.buyer_code"
          :item-props="getBuyerByName"
          :items="useBuyer().getBuyers"
          item-value="code"
          label="Select Buyer*"
          variant="outlined"
          required
          :rules="[useBuyer().rules.required]"
          density="compact"
          clearable
          auto-select-first
        ></v-autocomplete>
        <span> <buyer-create-in></buyer-create-in></span>
        <v-spacer></v-spacer>
        <v-text-field
        v-model="search"
        density="compact"
        label="Search by Serial No.."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        flat
        single-line
        @keyup.enter="gettingProductBySlNo()"
      ></v-text-field>
      </div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-item v-if="Sale.getCart.buyer_code">
      <v-table height="300px" density="compact" fixed-header>
        <thead>
          <tr>
            <th
              :class="[header.title === 'Product Description' ? 'text-left bg-blue-lighten-4' : 'text-right bg-blue-lighten-4']"
              v-for="(header, index) in SalesHeaders"
              :key="index"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in Sale.getCartItems">
            <td @dblclick="Sale.RemoveFromCart(product)">
              {{ product.title }}
            </td>

            <td class="text-right">
              {{ currency(product.mrp) }}
            </td>
            <td class="text-right">
              {{ product.quantity }}
            </td>

            <td class="text-right">{{ currency(product.unit_price)}}</td>

            <td>
              <div class="d-flex justify-start">
                 
                  <span>
                    <actions :product="product" />
                  </span>
                  </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-blue-lighten-5">
            <th class="text-right">Invoice Total</th>
            <th></th>
            <th class="text-right">{{ Sale.CartTotalQty }}</th>
            <th class="text-right">
              {{ currency(Sale.CartTotalAmt) }}
            </th>
            <th></th>
          </tr>
          <tr>
            
            <th class="text-right">Collection</th>

            <th class="text-right">
              <input
                type="number"
                style="text-align: right"
                v-model.number="Sale.Cart.collection"
                maxlength="7"
                size="10"
                placeholder="(Collection here...)"
              />
            </th>
            <th></th>
            <th class="text-right">
              {{ currency(Sale.Cart.collection) }}
            </th>
            <th></th>
            
          </tr>
        </tfoot>
      </v-table>
    </v-card-item>
    <v-card-actions v-if="Sale.getCart.buyer_code">
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="Sale.EmptyCart()"
      >
        Cancel
      </v-btn>
      <v-btn
        color="blue-darken-1"
        variant="text"
        type="submit"
        :loading="Sale.loadingSaleCreate"
        :disabled="!isPayment"
        >Save
      </v-btn>
    </v-card-actions>
  </v-form>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useBuyer, useInvoice } from '../../../stores';
  import { buyerType } from '../../Types/partyTypes';
  import BuyerCreateIn from '../../Buyers/Forms/BuyerCreateIn.vue';
  import actions from './Actions.vue'
  import { useCurrency } from '../../../composables/useCurrency';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  let { currency } = useCurrency()

  const Sale = useInvoice()

  const search = ref()

  const SalesHeaders = ref([
          {title: 'Product Description', key: 'title', align: 'left'},
          {title: 'Unit Price', key: 'Sale_price', align: 'right'},
          {title: 'Quantity', key: 'quantity', align: 'right'},
          {title: 'Unit Total', key: 'unit_total', align: 'right'},
          {title: 'Actions', key: 'action', align: 'right'}
        ])
  const isPayment = computed(()=> {
    if(Sale.getCart.collection !=undefined && String(Sale.getCart.collection) != "") {
      return Number(Sale.getCart.collection) <0 || Number(Sale.getCart.collection) > Number(Sale.CartTotalAmt) ? false : true
    }
  })

  function gettingProductBySlNo(){
    useInvoice().getProductBySlNo(search.value)
    search.value = ''
  }

  function getBuyerByName(item: buyerType) {
      return { title: item.name}
    } 
</script>
