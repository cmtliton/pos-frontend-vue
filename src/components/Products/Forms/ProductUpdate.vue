<template>
  <v-row justify="center">
    <v-dialog v-model="Product.ProductUpdateDialog" persistent max-width="800px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-pencil"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="updatingProduct()"
        ></v-btn>
      </template>
      <v-card>
        <v-form v-model="Product.formProductCreate" @submit.prevent="Product.creatingProduct()">
          <v-card-title>
            <span class="text-h5">Edit Product</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12" sm="6" md="4">
                  <div class="d-flex justify-start">
                <v-autocomplete
                v-model.number="Product.editedProduct.item_id"
                  :item-props="getItemByName"
                  :items="useItem().getItems"
                  item-value="id"
                  label="Select Item*"
                  variant="outlined"
                  required
                  :rules="[Product.rules.required]"
                  density="compact"
                  auto-select-first
                ></v-autocomplete>
               <span> <item-create-in></item-create-in></span>
                </div>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <div class="d-flex justify-start">
                <v-autocomplete
                v-model.number="Product.editedProduct.brand_id"
                :item-props="getBrandByName"
                  :items="useBrand().getBrands"
                  item-value="id"
                  label="Select Brand*"
                  variant="outlined"
                  required
                  density="compact"
                  :rules="[Product.rules.required]"
                  auto-select-first
                ></v-autocomplete>
                <span><brand-create-in></brand-create-in></span>
                  </div>
              </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Product Title"
                    required
                    v-model.trim="Product.editedProduct.name"
                    :rules="[Product.rules.required]"
                    variant="outlined"
                    :error-messages="Product.getProductErrors.name[0] ? Product.getProductErrors.name[0] : ''"
                    @blur="Product.ClearProductNameError, Product.CheckProduct(Product.editedProduct)"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Product Code"
                    required
                    v-model.trim="Product.editedProduct.code"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Product Cost"
                    required
                    v-model.number="Product.editedProduct.purchase_price"
                    variant="outlined"
                    :error-messages="Product.getProductErrors.purchase_price[0] ? Product.getProductErrors.purchase_price[0] : ''"
                    @blur="Product.ClearProductPriceError"
                    density="compact"
                    :rules="[Product.rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Product Price"
                    required
                    v-model.number="Product.editedProduct.mrp"
                    variant="outlined"
                    :error-messages="Product.getProductErrors.mrp[0] ? Product.getProductErrors.mrp[0] : ''"
                    @blur="Product.ClearProductMrpError"
                    density="compact"
                    :rules="[Product.rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Product Quantity"
                    required
                    v-model.number="Product.editedProduct.quantity"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                    :disabled="true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Warranty(M)"
                    required
                    v-model.number="Product.editedProduct.warranty"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                    placeholder="36"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                <v-select
                v-model.trim="Product.editedProduct.measuring_unit"
                  :items="['Piece','Kg', 'Meter', 'Dozen', 'Box', 'Sqf']"
                  label="Measuring Unit"
                  variant="outlined"
                  :error-messages="Product.getProductErrors.measuring_unit[0] ? Product.getProductErrors.measuring_unit[0] : ''"
                  @blur="Product.ClearProductMeasuringError"
                  required
                  density="compact"
                ></v-select>
              </v-col>

              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="Product.closeUpdateProductDialog()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :disabled="!Product.formProductCreate"
              :loading="Product.loadingProductCreate"
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
    import { useProduct, useItem, useBrand } from './../../../stores'
    import { productType, itemType } from '../../Types/productTypes';
    import ItemCreateIn from '../../Items/Forms/ItemCreateIn.vue';
    import BrandCreateIn from '../../Brands/Forms/BrandCreateIn.vue';

    let ProductFrmProducts = defineProps({
      product: Object as PropType<productType>
    })

    const Product = useProduct()

  function updatingProduct() {
    let index = Product.Products.find((prd)=> prd.id === ProductFrmProducts.product?.id)
    Product.editedProduct = Object.assign({}, index)
    if(index !== undefined) {
      Product.editedIndex = Product.Products.indexOf(index)
    }
  }

  function getItemByName(item: itemType) {
    return { title: item.name}
  }
  function getBrandByName(item: itemType) {
    return { title: item.name}
  }
</script>