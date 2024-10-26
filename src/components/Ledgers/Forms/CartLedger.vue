<template>
  <v-card>
    <v-form class="mx-auto" v-model="Ledger.formLedgerCreate" @submit.prevent="Ledger.SaveLedger()">
    <v-card-subtitle>
      <div class="d-flex justify-start">
        <v-sheet class="ma-2"
          >Ledger No: {{Ledger.getJoinWithCart.TRN}}</v-sheet
        >
        <v-sheet class="mt-2"
          >Date:
          <input
            type="datetime-local"
            v-model="Ledger.getJoinWithCart.created_at"
          />
        </v-sheet>
      </div>

      <div class="d-flex justify-start mt-3">
      <v-select
        v-model.trim="Ledger.getJoinWithCart.type"
        label="Select Transaction Type*"
        :items="['Payment', 'Receive']"
        variant="outlined"
        density="compact"
        :rules="[Ledger.rules.required]"
        required
      ></v-select>
      </div>
      <div class="d-flex justify-start" v-if= "Ledger.getJoinWithCart.type !== 'Receive'">
        <v-autocomplete
          v-model.number="Ledger.getJoinWithCart.party_code"
          :item-props="getSupplierByName"
          :items="useSupplier().getSuppliers"
          item-value="code"
          label="Select Supplier*"
          variant="outlined"
          required
          :rules="[Ledger.rules.required]"
          density="compact"
          clearable
          auto-select-first
        ></v-autocomplete>
        <span> <supplier-create-in></supplier-create-in></span>
      </div>

      <div class="d-flex justify-start" v-else>
        <v-autocomplete
          v-model.number="Ledger.getJoinWithCart.party_code"
          :item-props="getBuyerByName"
          :items="useBuyer().getBuyers"
          item-value="code"
          label="Select Buyer/Investor/Lender*"
          variant="outlined"
          required
          :rules="[Ledger.rules.required]"
          density="compact"
          clearable
          auto-select-first
        ></v-autocomplete>
        <span> <buyer-create-in></buyer-create-in></span>
      </div>
      
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-item>
      <v-table height="250px" density="compact" fixed-header>
        <thead>
          <tr>
            <th
              :class="[header.title === 'Amount' ? 'text-right bg-green-darken-2' : 'text-left bg-green-darken-2']"
              v-for="(header, index) in LedgersHeaders"
              :key="index"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-light-blue-lighten-5">
            <td>{{ Ledger.getCartWithAccount?.title }}</td>

            <td>
              <v-textarea
                rows="1"
                cols="50"
                v-model.trim="Ledger.Cart.description"
                placeholder="type description..."
                single-line
                density="compact"
                bg-color="light-blue-lighten-5"
              ></v-textarea>
            </td>

            <td>
              <v-text-field
              v-model.number="Ledger.Cart.amount"
              :rules="[Ledger.rules.required]"
              required
              density="compact"
              bg-color="light-blue-lighten-5"
              type="number"
              ></v-text-field>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th class="text-left">{{}}</th>

            <th class="text-left pt-3">
              <v-text-field
              :label="Ledger.getJoinWithCart.type !== 'Receive'? 'Payment':'Collection'"
              v-model.number="Ledger.Cart.payment"
              :rules="[Ledger.rules.required]"
              :error-messages="Ledger.CheckAmount ? '' : 'Please Check Transaction Amount!'"
              required
              bg-color="white"
              base-color="blue"
              density="compact"
              variant="outlined"
              type="number"
              >
              </v-text-field>
            </th>
            <th class="text-right">{{ currency(Ledger.Cart.payment) }}</th>
          </tr>
        </tfoot>
      </v-table>
    </v-card-item>
    <v-card-actions>
      <v-btn color="blue-darken-1" variant="text" @click="Ledger.EmptyCart()">
        Cancel
      </v-btn>
      <v-btn
        color="blue-darken-1"
        variant="text"
        type="submit"
        :loading="Ledger.loadingLedgerCreate"
        :disabled="!Ledger.formLedgerCreate"
        >Save
      </v-btn>
    </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useSupplier, useBuyer, useLedger } from '../../../stores';
  import { buyerType, supplierType } from '../../Types/partyTypes';
  import SupplierCreateIn from '../../Suppliers/Forms/SupplierCreateIn.vue';
  import BuyerCreateIn from '../../Buyers/Forms/BuyerCreateIn.vue';
  import { useCurrency } from '../../../composables/useCurrency';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  let { currency } = useCurrency()

  const Ledger = useLedger()

  const LedgersHeaders = ref([
          {title: 'Account Name', key: 'title', align: 'left'},
          {title: 'Description', key: 'description', align: 'left'},
          {title: 'Amount', key: 'amount', align: 'right'}
        ])

  function getSupplierByName(item: supplierType) {
      return { title: item.name}
    }

  function getBuyerByName(item: buyerType) {
      return { title: item.name}
    }

</script>
