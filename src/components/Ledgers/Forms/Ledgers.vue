<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
  <v-card class="mx-auto">
    <v-card-title class="d-flex align-center pe-2">
      <v-btn color="blue-darken-1" variant="flat" rounded="lg" @click="LedgerInitialize()">
        New
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
      :headers="LedgersHeaders"
      :items="Ledger.getLedgersWithAccountBySort"
      :loading = "Ledger.loadingLedgerCreate"
      density="compact"
      height="400px"
      fixed-header
      v-model:search="search"
      item-value="TRN"
      row
      :sort-by="[{ key: 'TRN', order: 'desc' }]"
      justify-center
    >
      <template v-slot:item="{ item }">
        <tr :class="color(item.type_code)">
          <td>{{item.TRN}}</td>
          <td>{{dayjs(item.created_at).format('DD-MM-YYYY hh:mm A')}}</td>
          <td class="text-left">{{item.type_name+' '+item.account_name}}</td>
          <td class="text-left">{{item.type}}</td>
          <!-- <td class="text-left">{{item.description}}</td> -->
          <td class="text-right">{{useCurrency().currency(item.amount)}}</td>
          <td class="text-left">{{item.party_name}}</td>
          <td>
          <PrintInvoice :item="item"/>
            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props" flat size="x-small"></v-btn>
              </template>
              <v-list :lines="false" density="compact">
              <v-list-item rounded="xl" link @click="Ledger.updatingLedger(item)">
                <v-list-item-title>Edit Ledger</v-list-item-title>
              </v-list-item>
              <v-list-item rounded="xl" link @click="Ledger.deleteLedger(item.id)">
                <v-list-item-title>Delete Ledger</v-list-item-title>
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
  import { ref, onMounted} from "vue"
  import { useRouter } from "vue-router";
  import { useUser, useSupplier, useLedger, useAccount, useBuyer } from "../../../stores";
  import PrintInvoice from "../Reports/PrintInvoice.vue";
  import { useCurrency } from "../../../composables/useCurrency";
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const router = useRouter()

  const User = useUser()
  const Ledger = useLedger()

  const search = ref('')

    const LedgersHeaders = ref([
    { key: 'TRN', title: 'Invoice No'},
    { key: 'created_at', title: 'Invoice Date' },
    { key: 'account_name', title: 'Account Name' },
    { key: 'type', title: 'Type' },
    //{ key: 'description', title: 'Description' },
    { key: 'amount', title: 'Amount' },
    { key: 'party_code', title: 'Party' },
    { key: 'Actions', title: 'Actions' }
    ])

    function LedgerInitialize() {
      Ledger.initializeTRN()
      router.push('/CreateLedger')
    }

    function color(liton:any) {
    switch (liton) {
      case 'CA': return 'bg-teal-accent-2'
      case 'FA': return 'bg-teal-accent-3'
      case 'FE': return 'bg-blue-grey-lighten-3'
      case 'VE': return 'bg-indigo-lighten-1'
      case 'OE': return 'bg-indigo-lighten-2'
      case 'NOE': return 'bg-indigo-lighten-3'
      case 'D' : return 'bg-green-darken-3'
      case 'CL': return 'bg-amber-accent-1'
      case 'FL': return 'bg-amber-accent-3'
      default: return 'bg-teal'
    }
  }

onMounted(()=> {
        const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
       if(cmpid !== undefined && Ledger.getLedgers.length<1) {
          useSupplier().loadingSuppliers(cmpid)
          useBuyer().loadingBuyers(cmpid)
          Ledger.loadingLedgers(cmpid)
          useAccount().loadingAccounts(cmpid)
        }
      })
</script>