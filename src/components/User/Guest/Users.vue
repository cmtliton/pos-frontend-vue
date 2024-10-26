<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
          <v-card-title class="d-flex align-center pe-2">
            <span><UserCreate></UserCreate></span>

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
            :headers="UserHeaders"
            :items="User.getUsers"
            :loading = User.loadingUserCreate
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
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
                <td>{{item.name}}</td>
                <td>{{item.username}}</td>
                <td>{{item.mobileno}}</td>
                <td>{{item.addr}}</td>
                
                <td>
                  <span :class="item.role === 'Admin'? 'text-teal' : 'text-red'">
                    {{ item.role }}
                  </span>
                </td>
                <td @click="User.ChangeStatusInUser(item)">
                  <span :class="item.status? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>{{dayjs(item.created_at).fromNow()}}</td>
                <td>
                  <div class="d-flex justify-start">
            <span> <UserUpdate :user="item" /> </span>
            <span> <UserRemove :user="item" /></span>
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
  import { onMounted, ref } from "vue"
  import UserCreate from "./UserCreate.vue"
  import UserUpdate from "./UserUpdate.vue"
  import UserRemove from "./UserRemove.vue"
  import { useUser } from './../../../stores'
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);
  const User = useUser()

    const search = ref('')
      const UserHeaders = ref([
      { key: 'name', title: 'Name'},
      { key: 'username', title: 'User Name' },
      { key: 'mobileno', title: 'Mobile No' },
      { key: 'addr', title: 'Address' },
      { key: 'role', title: 'Role' },
      { key: 'status', title: 'Status' },
      { key: 'created_at', title: 'Created Date' },
      { key: 'Actions', title: 'Actions' }
      ])
      onMounted(()=>{
        const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
       if(cmpid !== undefined && User.getUsers.length<2) {
        User.LoadUsers(cmpid)
       }
      })
</script>
