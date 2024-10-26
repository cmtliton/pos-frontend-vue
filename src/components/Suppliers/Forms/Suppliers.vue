<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
          <v-card-title class="d-flex align-center pe-2">
            <span><SupplierCreate></SupplierCreate></span>

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
            :headers="SuppliersHeaders"
            :items="Supplier.getSuppliers"
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
            :loading="Supplier.loadingSupplierCreate"
            density="compact"
            height="400px"
            fixed-header
            v-model:search="search"
            Supplier-value="name"
            row
            justify-center
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{item.name}}</td>
                <td>{{item.mobileno}}</td>
                <td>{{item.addr}}</td>
                <td>
                  <span :class="item.type === 'B2B'? 'text-teal' : 'text-red'">
                    {{ item.type }}
                  </span>
                </td>
                <td @click="Supplier.ChangeStatusInSupplier(item)">
                  <span :class="item.status ? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>{{dayjs(item.created_at).fromNow()}}</td>
                <td>
                <div class="d-flex justify-start">
                  <span><SupplierUpdate :supplier="item"/></span>
                  <span>
                    <SupplierRemove :supplier="item" />
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
  import SupplierCreate from "./SupplierCreate.vue"
  import SupplierUpdate from "./SupplierUpdate.vue"
  import SupplierRemove from "./SupplierRemove.vue"
  import { useSupplier, useUser } from './../../../stores'

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const Supplier = useSupplier()
  const User = useUser()

    const search = ref('')
      const SuppliersHeaders = ref([
      { key: 'name', title: 'Supplier Name'},
      { key: 'mobileno', title: 'Mobile No.'},
      { key: 'addr', title: 'Address' },
      { key: 'type', title: 'Type' },
      { key: 'status', title: 'Status' },
      { key: 'created_at', title: 'Created Date' },
      { key: 'Actions', title: 'Actions' }
      ])
      onMounted(()=> {
        const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
       if(cmpid !== undefined && Supplier.getSuppliers.length<1) {
          Supplier.loadingSuppliers(cmpid)
        }
      })
</script>
