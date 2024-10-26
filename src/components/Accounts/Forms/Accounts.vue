<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
          <v-card-title class="d-flex align-center pe-2">
            <span><AccountCreate></AccountCreate></span>

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
            :headers="AccountsHeaders"
            :items="Account.getAccountsWithType"
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
            :loading="Account.loadingAccountCreate"
            density="compact"
            height="400px"
            fixed-header
            v-model:search="search"
            Account-value="name"
            row
            justify-center
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{item.name}}</td>
                <td>{{item.description}}</td>
                <td>
                  <span :class="item.type_name === 'Income' ? 'text-teal' : 'text-red' &&
                   item.type_name === 'Current Asset' ? 'text-teal' : 'text-red' &&
                   item.type_name === 'Fixed Asset' ? 'text-teal' : 'text-red' &&
                   item.type_name === 'Deposit' ? 'text-teal' : 'text-red'
                   ">
                    {{ item.type_name }}
                  </span>
                </td>
                <td>{{dayjs(item.created_at).fromNow()}}</td>
                <td @click="Account.ChangeStatusInAccount(item)">
                  <span :class="item.status? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>
                <div class="d-flex justify-start">
                  <span><AccountUpdate :category="item"/></span>
                  <span>
                    <AccountRemove :category="item" />
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
  import AccountCreate from "./AccountCreate.vue"
  import AccountUpdate from "./AccountUpdate.vue"
  import AccountRemove from "./AccountRemove.vue"
  import { useAccount, useUser } from './../../../stores'

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const Account = useAccount()

    const search = ref('')
      const AccountsHeaders = ref([
      { key: 'name', title: 'Account Name'},
      { key: 'description', title: 'Description'},
      { key: 'account_type_id', title: 'Account Type' },
      { key: 'created_at', title: 'Created Date' },
      { key: 'status', title: 'Status' },
      { key: 'Actions', title: 'Actions' }
      ])
    
      onMounted(()=> {
        //Account.loadingAccount_Types()
        const cmpid: string | undefined = useUser().getUser.company_id? useUser().getUser.company_id : useUser().user.company_id
       if(cmpid !== undefined && Account.getAccounts.length<1) {
          Account.loadingAccounts(cmpid)
        }
      })
</script>
