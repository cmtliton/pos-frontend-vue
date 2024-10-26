<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
  <v-card class="mx-auto">
    <v-card-title class="d-flex align-center pe-2">
      <v-btn color="blue-darken-1" variant="flat" rounded="xl" @click="initializeInvoice()">
        Create Invoice
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
      :headers="SalesHeaders"
      :items="Sales"
      density="compact"
      height="400px"
      fixed-header
      v-model:search="search"
      item-value="InvoiceNo"
      row
      justify-center
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{item.InvoiceNo}}</td>
          <td>{{item.Date}}</td>
          <td>{{item.ITotalQty}}</td>
          <td>{{item.ITotalAmt}}</td>
          <td>
            <span :class="item.Status? 'text-red': 'text-teal' ">
              {{item.Status? "Pending": "Delivered"}}
            </span>
          </td>
          <td>
            <v-icon
              size="small"
              color="teal"
              class="me-2"
              icon="mdi-printer"
            ></v-icon>
            <v-icon size="small" color="teal" class="me-2">mdi-delete</v-icon>
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
  import { useBuyer, useInvoice, useProduct } from "../../../stores";
  import { useUser } from "../../../stores";

  const router = useRouter()
  const User = useUser()
  const Sale = useInvoice()

  const search = ref('')  

    const Sales = ref([
     {InvoiceNo: 1, Date: '01/12/2023', ITotalQty:100, ITotalAmt: 1200, Status: false, Actions: true},
     {InvoiceNo: 2, Date: '01/12/2023', ITotalQty:90, ITotalAmt: 1800, Status: true, Actions: true},
     {InvoiceNo: 3, Date: '01/12/2020', ITotalQty:100, ITotalAmt: 1200, Status: true, Actions: true},
     {InvoiceNo: 4, Date: '01/12/2023', ITotalQty:100, ITotalAmt: 4200, Status: true, Actions: true},
     {InvoiceNo: 5, Date: '01/12/2019', ITotalQty:23, ITotalAmt: 16900, Status: false, Actions: true},
     {InvoiceNo: 6, Date: '01/12/2023', ITotalQty:100, ITotalAmt: 1200, Status: true, Actions: true},
     {InvoiceNo: 7, Date: '01/12/2023', ITotalQty:45, ITotalAmt: 1800, Status: true, Actions: true},
     {InvoiceNo: 8, Date: '01/12/2021', ITotalQty:100, ITotalAmt: 1200, Status: true, Actions: true},
     {InvoiceNo: 9, Date: '01/12/2021', ITotalQty:100, ITotalAmt: 1200, Status: true, Actions: true},
     {InvoiceNo: 10, Date: '01/12/2021', ITotalQty:100, ITotalAmt: 1200, Status: true, Actions: true},
     {InvoiceNo: 11, Date: '01/12/2021', ITotalQty:100, ITotalAmt: 1200, Status: true, Actions: true}
    ])

    const SalesHeaders = ref([
    { key: 'inv', title: 'Invoice No'},
    { key: 'created_at', title: 'Date' },
    { key: 'quantity', title: 'Sales(Quantity)' },
    { key: 'amount', title: 'Sales(Amount)' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' }
    ])

    function initializeInvoice() {
      Sale.initializingInvoice()
      router.push('/CreateInvoice')
    }
    onMounted(()=>{
      const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
      if(cmpid !== undefined && Sale.getSales.length<2) {
        useBuyer().loadingBuyers(cmpid)
        Sale.loadingSales(cmpid)
      }
      if(cmpid !== undefined && useProduct().getProducts.length<2) {
        useProduct().loadingProducts(cmpid)
      }
    })
</script>