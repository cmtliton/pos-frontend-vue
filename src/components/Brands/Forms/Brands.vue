<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="mx-auto">
          <v-card-title class="d-flex align-center pe-2">
            <span><BrandCreate></BrandCreate></span>

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
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
            :headers="BrandsHeaders"
            :items="Brand.getBrands"
            :loading ="Brand.loadingBrandCreate"
            density="compact"
            height="400px"
            fixed-header
            v-model:search="search"
            item-value="name"
            row
            justify-center
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{item.name}}</td>
                <td>{{dayjs(item.created_at).fromNow()}}</td>
                <td @click="Brand.ChangeStatusInBrand(item)">
                  <span :class="item.status? 'text-teal': 'text-red' ">
                    {{item.status? "Active": "Deactive"}}
                  </span>
                </td>
                <td>
                <div class="d-flex justify-start">
                  <span><BrandUpdate :brand="item"/></span>
                  <span>
                    <BrandRemove :brand="item" />
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
  import BrandCreate from "./BrandCreate.vue"
  import BrandUpdate from "./BrandUpdate.vue"
  import BrandRemove from "./BrandRemove.vue"
  import { useBrand } from './../../../stores'

  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  const Brand = useBrand()

    const search = ref('')

      const BrandsHeaders = ref([
      { key: 'name', title: 'Brand Name'},
      { key: 'created_at', title: 'Created Date' },
      { key: 'status', title: 'Brand Status' },
      { key: 'Actions', title: 'Actions' }
      ])
</script>
