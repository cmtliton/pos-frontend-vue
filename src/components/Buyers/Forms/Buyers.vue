<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
          <v-card-title class="d-flex align-center pe-2">
            <span><BuyerCreate></BuyerCreate></span>

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
            :headers="BuyersHeaders"
            :items="Buyer.getBuyersBySort"
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
            :loading="Buyer.loadingBuyerCreate"
            density="compact"
            height="400px"
            fixed-header
            v-model:search="search"
            item-value="name"
            row
            justify-center
          >
            <template v-slot:item="{ item }">
              <tr :class="color(item.type)">
                <td>{{item.name}}</td>
                <td>{{item.mobileno}}</td>
                <td>{{item.addr}}</td>
                <td>{{ item.title }}</td>
                <td @click="Buyer.ChangeStatusInBuyer(item)">
                  <span :class="item.status ? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>{{dayjs(item.created_at).fromNow()}}</td>
                <td>
                <div class="d-flex justify-start">
                  <span><BuyerUpdate :Buyer="item"/></span>
                  <span>
                    <BuyerRemove :Buyer="item" />
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
  import BuyerCreate from "./BuyerCreate.vue"
  import BuyerUpdate from "./BuyerUpdate.vue"
  import BuyerRemove from "./BuyerRemove.vue"
  import { useBuyer, useUser } from './../../../stores'

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const Buyer = useBuyer()
  const User = useUser()

    const search = ref('')
      const BuyersHeaders = ref([
      { key: 'name', title: 'Buyer Name'},
      { key: 'mobileno', title: 'Mobile No.'},
      { key: 'addr', title: 'Address' },
      { key: 'name', title: 'Type' },
      { key: 'status', title: 'Status' },
      { key: 'created_at', title: 'Created Date' },
      { key: 'Actions', title: 'Actions' }
      ])
      onMounted(()=> {
        const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
       if(cmpid !== undefined && Buyer.getBuyers.length<1) {
          Buyer.loadingBuyers(cmpid)
        }
      })

    function color(liton:any) {
    switch (liton) {
      case 'buyer': return 'text-teal'
      case 'investor': return 'text-green-lighten-2'
      case 'lender': return 'text-red'
      default: return 'bg-teal'
    }
  }
</script>
