<template>
    <v-row justify="center">
        <v-menu transition="scale-transition">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        v-bind="props"
                        flat
                        size="x-small"
                        class="ma-2 pa-2"
                      ></v-btn>
                    </template>
                    <v-list :lines="false" density="compact">

                      <v-list-item rounded="xl" link @click="usePurchase().editForCart(product)">
                        <v-list-item-subtitle>Edit Item</v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item rounded="xl" link @click="usePurchase().RemoveFromCart(product)">
                        <v-list-item-subtitle>Delete Item</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                    
                  </v-menu>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { usePurchase } from '../../../stores';
  defineProps({
    product: Object
  })
  </script>