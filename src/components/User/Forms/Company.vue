<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
            
          <v-data-table
            :headers="CmpHeaders"
            :items="User.getCmpProfile"
            :loading="User.loadingUserCreate"
            density="compact"
            fixed-header
            item-value="name"
            height="100px"
            row
            justify-center
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{item.name}}</td>
                <td>{{item.mobileno}}</td>
                <td>{{item.addr}}</td>
                <td @click="">
                  <span :class="item.status? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>{{dayjs(item.created_at).fromNow()}}</td>
                <td>
                  <div class="d-flex justify-start">
                    <span><CmpUpdate :Cmp="item"></CmpUpdate></span>
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
  import { ref } from "vue"
  import { useUser } from './../../../stores'
  import CmpUpdate from './CmpUpdate.vue'
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);
  const User = useUser()

  
    const CmpHeaders = ref([
        { key: 'name', title: 'Company Name'},
        { key: 'mobileno', title: 'Mobile No.' },
        { key: 'addr', title: 'Address' },
        { key: 'status', title: 'Status' },
        { key: 'created_at', title: 'Created Date' },
        { title: 'Actions', key: 'actions'},
        ])

</script>
