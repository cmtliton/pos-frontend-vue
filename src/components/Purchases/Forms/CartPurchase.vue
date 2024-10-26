<template>
  <v-card class="mx-auto">
    <v-form class="mx-auto" v-model="Purchase.formPurchaseCreate" @submit.prevent="Purchase.SavePurchase()">
    <v-card-subtitle>
      <div class="d-flex justify-start">
        <v-sheet class="ma-2"
          >Purchase No: {{usePurchase().getCart.PRN}}</v-sheet
        >
        <v-sheet class="mt-2"
          >Date:
        <input type="datetime-local" v-model="usePurchase().Cart.created_at"/>
        
      </v-sheet>
      </div>
      <div class="d-flex justify-start mt-3">
        <v-autocomplete
          v-model.number="usePurchase().Cart.supplier_code"
          :item-props="getSupplierByName"
          :items="useSupplier().getSuppliers"
          item-value="code"
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
    <v-card-item v-if="usePurchase().getCart.supplier_code">
      <v-table height="300px" density="compact" fixed-header>
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
          <tr v-for="product in Purchase.getCartItems">
            <td @dblclick="Purchase.RemoveFromCart(product)">
              {{ product.title }}
            </td>

            <td
              class="text-right"
              @dblclick="Purchase.editForCart(product)"
              v-if="Purchase.editedItem.product_id !== product.product_id"
            >
              {{ currency(product.purchase_price) }}
            </td>

            <td v-else class="bg-deep-purple-lighten-5">
              <input
                type="number"
                style="text-align: right"
                @blur="Purchase.UpdateInCart()"
                v-model.number="Purchase.editedItem.purchase_price"
              />
            </td>

            <td
              class="text-right"
              @dblclick="Purchase.editForCart(product)"
              v-if="Purchase.editedItem.product_id !== product.product_id"
            >
              {{ product.quantity }}
            </td>

            <td v-else class="bg-deep-purple-lighten-5">
              <input
                type="number"
                style="text-align: right"
                @blur="Purchase.UpdateInCart()"
                v-model.number="Purchase.editedItem.quantity"
              />
            </td>

            <td class="text-right">{{ currency(product.unit_price)}}</td>

            <td>
              <div class="d-flex justify-start">
                  <span v-show="Purchase.getCart.status === true && Purchase.filteredSlNos(product).length !== product.quantity && product.id !== ''"><TakingSlNo :product="product"/></span>
                  <span>
                    <Actions :product="product" />
                  </span>
                  </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th class="text-right">Purchase Total</th>
            <th></th>
            <th class="text-right">{{ Purchase.CartTotalQty }}</th>
            <th class="text-right">
              {{ currency(Purchase.CartTotalAmt) }}
            </th>
            <th></th>
          </tr>
          <tr>
            <th></th>
            <th class="text-right">Payment</th>

            <th class="text-right">
              <input
                type="number"
                style="text-align: right"
                v-model.number="Purchase.Cart.purchase_payment"
                maxlength="7"
                size="5"
                placeholder="(Payment here...)"
              />
            </th>
            <th class="text-right">
              {{ currency(Purchase.Cart.purchase_payment) }}
            </th>
            <th></th>
          </tr>
        </tfoot>
      </v-table>
    </v-card-item>
    <v-card-actions v-if="Purchase.getCart.supplier_code">
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="Purchase.EmptyCart()"
      >
        Cancel
      </v-btn>
      <v-btn
        color="blue-darken-1"
        variant="text"
        type="submit"
        :loading="Purchase.loadingPurchaseCreate"
        :disabled="!isPayment"
        >Save
      </v-btn>
    </v-card-actions>
  </v-form>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useSupplier, usePurchase } from '../../../stores';
  import { supplierType } from '../../Types/partyTypes';
  import SupplierCreateIn from '../../Suppliers/Forms/SupplierCreateIn.vue';
  import TakingSlNo from './TakingSlNo.vue';
  import Actions from './Actions.vue';
  import { useCurrency } from '../../../composables/useCurrency';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  let { currency } = useCurrency()

  const Purchase = usePurchase()

  const PurchasesHeaders = ref([
          {title: 'Product Description', key: 'title', align: 'left'},
          {title: 'Unit Price', key: 'purchase_price', align: 'right'},
          {title: 'Quantity', key: 'quantity', align: 'right'},
          {title: 'Unit Total', key: 'unit_total', align: 'right'},
          {title: 'Actions', key: 'action', align: 'right'}
        ])
  const isPayment = computed(()=> {
    if(Purchase.getCart.purchase_payment !=undefined && String(Purchase.getCart.purchase_payment) != "") {
      return Number(Purchase.getCart.purchase_payment) <0 || Number(Purchase.getCart.purchase_payment) > Number(Purchase.CartTotalAmt) ? false : true
    }
  })

  function getSupplierByName(item: supplierType) {
      return { title: item.name}
    }
</script>
