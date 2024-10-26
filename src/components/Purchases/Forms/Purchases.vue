<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
  <v-card class="mx-auto">
    <v-card-title class="d-flex align-center pe-2">
      <v-btn color="blue-darken-1" variant="flat" rounded="lg" @click="PurchaseInitialize()">
        Purchase
      </v-btn>
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
      :headers="PurchasesHeaders"
      :items="Purchase.getPurchasesBySort"
      :loading = "Purchase.loadingPurchaseCreate"
      density="compact"
      height="400px"
      fixed-header
      v-model:search="search"
      item-value="PRN"
      row
      justify-center
      :sort-by="[{ key: 'PRN', order: 'desc' }]"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{item.PRN}}</td>
          <td>{{dayjs(item.created_at).format('DD-MM-YYYY hh:mm A')}}</td>
          <td class="text-center">{{item.cart_total_quantity}}</td>
          <td class="text-right">{{useCurrency().currency(item.cart_total_amount)}}</td>
          <td>
            <span :class="item.status? 'text-teal': 'text-red' ">
              {{item.status? "Confirmed": "Ordered"}}
            </span>
          </td>
          <td>
          <PrintInvoice :item="item"/>
            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props" flat size="x-small"></v-btn>
              </template>
              <v-list :lines="false" density="compact">
              <v-list-item rounded="xl" link @click="Purchase.updatingPurchase(item)">
                <v-list-item-title>Edit Purchase</v-list-item-title>
              </v-list-item>
              <v-list-item rounded="xl" link @click="Purchase.confirmPurchase(item)">
                <v-list-item-title>Confirm Purchase</v-list-item-title>
              </v-list-item>
              <v-list-item rounded="xl" link @click="Purchase.DeletePurchase(item)">
                <v-list-item-title>Delete Purchase</v-list-item-title>
              </v-list-item>
            </v-list>
            </v-menu>
            
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
  import { useRouter } from "vue-router";
  import { useUser, useSupplier, usePurchase, useProduct } from "../../../stores";
  import PrintInvoice from "../Reports/PrintInvoice.vue";
  import { useCurrency } from "../../../composables/useCurrency";
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const router = useRouter()

  const User = useUser()
  const Purchase = usePurchase()

  const search = ref('')

    const PurchasesHeaders = ref([
    { key: 'PRN', title: 'Purchase No'},
    { key: 'created_at', title: 'Purchase Date' },
    { key: 'cart_total_quantity', title: 'Purchase(Quantity)' },
    { key: 'cart_total_amount', title: 'Purchase(Amount)' },
    { key: 'status', title: 'Status' },
    { key: 'Actions', title: 'Actions' }
    ])

    function PurchaseInitialize() {
      Purchase.initializePRN()
      router.push('/CreatePurchase')
    }

onMounted(()=> {
        const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
       if(cmpid !== undefined && Purchase.getPurchases.length<3) {
          useSupplier().loadingSuppliers(cmpid)
          Purchase.loadingPurchases(cmpid)
          useProduct().loadingProducts(cmpid)
        }
      })
</script>