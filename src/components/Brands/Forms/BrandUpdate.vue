<template>
  <v-row justify="center">
    <v-dialog v-model="Brand.BrandUpdateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-pencil"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="Brand.updatingBrand(BrandFrmBrands.brand?.id)"
        ></v-btn>
      </template>
      <v-card prepend-icon="mdi-pencil" title="Edit Item">
        <v-form v-model="Brand.formBrandCreate" @submit.prevent="Brand.creatingBrand()">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Brand Name"
                    required
                    v-model.trim="Brand.editedBrand.name"
                    :rules="[Brand.rules.required]"
                    variant="outlined"
                    :error-messages="Brand.getBrandErrors.name[0] ? Brand.getBrandErrors.name[0] : ''"
                    @blur="Brand.ClearBrandNameError, Brand.CheckBrand(Brand.editedBrand)"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="Brand.closeUpdateBrandDialog()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :disabled="!Brand.formBrandCreate"
              :loading="Brand.loadingBrandCreate"
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
    import { useBrand } from './../../../stores'
    import { brandType } from '../../Types/productTypes';
  
    const Brand = useBrand()

    let BrandFrmBrands = defineProps({
      brand: Object as PropType<brandType>
    })

 </script>