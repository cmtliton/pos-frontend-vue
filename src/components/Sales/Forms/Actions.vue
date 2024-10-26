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

                      <v-list-item rounded="xl" link @click="useInvoice().editForCart(product)">
                        <update-invoice-item :product="product"/>
                      </v-list-item>

                      <v-list-item rounded="xl" link>
                        <delivery-item :product="product"/>
                      </v-list-item>

                      <v-list-item rounded="xl" link @click="useInvoice().RemoveFromCart(product)">
                        <v-list-item-subtitle>Delete Item</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                    
                  </v-menu>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { useInvoice } from '../../../stores';
  import UpdateInvoiceItem from './UpdateInvoiceItem.vue';
  import DeliveryItem from './DeliveryItem.vue';
  defineProps({
    product: Object
  })
  </script>