<template>
  <v-row justify="center">
    <v-dialog
      v-model="Invoice.dialogForUpdateSaleItem"
      persistent
      max-width="800px"
    >
      <template v-slot:activator="{ props }">
        <v-btn class="ma-2 pa-2" flat v-bind="props" @click="updatingCartItem()"
          >Create Delivery</v-btn
        >
      </template>
      <v-card prepend-icon="mdi-truck-delivery" title="Delivery">
        <v-form
          v-model="Invoice.formSaleCreate"
          @submit.prevent="Invoice.SaveInvoice()"
        >
          <v-divider />
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    label="Product Title"
                    required
                    v-model.trim="Invoice.editedItem.title"
                    variant="outlined"
                    density="compact"
                    :disabled="true"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Sale"
                    required
                    v-model.number="Invoice.editedItem.quantity"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                    :disabled="true"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Stock"
                    required
                    v-model.number="Invoice.editedItem.stock_qty"
                    variant="outlined"
                    density="compact"
                    :disabled="true"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Delivery"
                    required
                    v-model.number="Invoice.editedItem.delivery_qty"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="3">
                  <v-text-field
                    label="Purchase Price"
                    required
                    v-model.number="Invoice.editedItem.purchase_price"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                    :disabled="true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field
                    label="Sale Price"
                    required
                    v-model.number="Invoice.editedItem.mrp"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="3">
                  <v-select
                    :items="['Percentage', 'Fixed']"
                    density="compact"
                    label="Type"
                    v-model="Invoice.editedItem.disc_type"
                    variant="outlined"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="4" md="3">
                  <v-text-field
                    label="Discount"
                    required
                    v-model.number="Invoice.editedItem.discount"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3">
                  <v-select
                    :items="items"
                    density="compact"
                    label="Vat Type"
                    v-model="Invoice.editedItem.vat_type"
                    item-value="code"
                    :item-props="getName"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-text-field
                    label="Vat(%)"
                    required
                    v-model.number="Invoice.editedItem.vat"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                    placeholder="5"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3">
                  <v-select
                    :items="items"
                    density="compact"
                    label="Tax Type"
                    v-model="Invoice.editedItem.tax_type"
                    item-value="code"
                    :item-props="getName"
                    variant="outlined"
                    auto-select-first
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="3" md="3">
                  <v-text-field
                    label="Tax(%)"
                    required
                    v-model.number="Invoice.editedItem.tax"
                    variant="outlined"
                    :error-messages="''"
                    placeholder="2.5"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="Invoice.close()"
            >
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :disabled="!Invoice.loadingSaleCreate"
              :loading="Invoice.loadingSaleCreate"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'
  import { useInvoice } from './../../../stores'
  import { sale_detailType } from '../../Types/productTypes';

      const Invoice = useInvoice()
      let SaleItemFrmCart = defineProps({
        product: Object as PropType<sale_detailType>
      })

      const items = [
      { id: 1, code: 'I', name: 'Inclusive' },
      { id: 1, code: 'E', name: 'Exclusive' },
    ]

    function getName(item:any) {
      return { title: item.name }
    }

    function updatingCartItem(){
        Invoice.editedItem = Object.assign({}, SaleItemFrmCart.product)
      }
</script>
