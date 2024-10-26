<template>
<v-container>
  <v-card>
  <v-table fixed-header height="440px" density="compact">
    <thead>
      <tr>
        <th class="text-left" v-for="header in SalesHeaders">
          {{header.title}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in Sales" :key="item.InvoiceNo">
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
    </tbody>
  </v-table>
</v-card>
</v-container>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  //const search = ref('')

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
    { align: 'left', key: 'InvoiceNo', sortable: false, title: 'Invoice No'},
    { key: 'Date', title: 'Date' },
    { key: 'ITotalQty', title: 'Item Total(Qty)' },
    { key: 'ITotalAmt', title: 'Item Total(Tk)' },
    { key: 'Status', title: 'Status' },
    { key: 'Actions', title: 'Actions' }
    ])
</script>
