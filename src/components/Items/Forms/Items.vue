<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
          <v-card-title class="d-flex align-center pe-2">
            <span><ItemCreate></ItemCreate></span>

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
            :headers="ItemsHeaders"
            :items="Item.getItems"
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
            :loading="Item.loadingItemCreate"
            density="compact"
            height="400px"
            fixed-header
            v-model:search="search"
            item-value="name"
            row
            justify-center
          >
            <template v-slot:item="{ item }">
              <tr :class="item.id%2 === 1 ? 'bg-grey-lighten-4' : 'bg-grey-lighten-5'">
                <td>{{item.name}}</td>
                <td>{{item.description}}</td>
                <td>
                  <span :class="item.type === 'Current Asset'? 'text-teal' : 'text-red'">
                    {{ item.type }}
                  </span>
                </td>
                <td>{{dayjs(item.created_at).fromNow()}}</td>
                <td @click="Item.ChangeStatusInItem(item)">
                  <span :class="item.status? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>
                <div class="d-flex justify-start">
                  <span><ItemUpdate :category="item"/></span>
                  <span>
                    <ItemRemove :category="item" />
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
  import { ref } from "vue"
  import ItemCreate from "./ItemCreate.vue"
  import ItemUpdate from "./ItemUpdate.vue"
  import ItemRemove from "./ItemRemove.vue"
  import { useItem } from './../../../stores'

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const Item = useItem()

    const search = ref('')
      const ItemsHeaders = ref([
      { key: 'name', title: 'Item Name'},
      { key: 'description', title: 'Description'},
      { key: 'type', title: 'Item Type' },
      { key: 'created_at', title: 'Created Date' },
      { key: 'status', title: 'Item Status' },
      { key: 'Actions', title: 'Actions' }
      ])
</script>
