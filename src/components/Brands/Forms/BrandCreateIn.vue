<template>
  <v-row justify="center">
    <v-dialog v-model="Brand.BrandCreateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn icon size="x-small" v-bind="props">
        <v-icon color="grey-lighten-1"> mdi-plus </v-icon>
    </v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="New Brand">
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
            <v-btn color="blue-darken-1" variant="text" @click="Brand.close()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :loading="Brand.loadingBrandCreate"
              :disabled="!Brand.formBrandCreate"
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
  import { useBrand } from '../../../stores';
  const Brand = useBrand()
</script>