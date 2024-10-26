<template>
  <v-row justify="center">
    <v-dialog v-model="Supplier.SupplierCreateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn icon size="x-small" v-bind="props">
            <v-icon color="grey-lighten-1"> mdi-plus </v-icon>
    </v-btn>
      </template>
      <v-card>
        <v-form v-model="Supplier.formSupplierCreate" @submit.prevent="Supplier.creatingSupplier()">
          <v-card-title>
            <span class="text-h5">New Supplier</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="Supplier Name"
                    required
                    v-model.trim="Supplier.editedSupplier.name"
                    :rules="[Supplier.rules.required]"
                    variant="outlined"
                    :error-messages="Supplier.getSupplierErrors.name[0] ? Supplier.getSupplierErrors.name[0] : ''"
                    @blur="Supplier.ClearSupplierNameError, Supplier.CheckSupplier(Supplier.editedSupplier)"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Mobile No."
                    required
                    :rules="[Supplier.rules.required]"
                    v-model.trim="Supplier.editedSupplier.mobileno"
                    variant="outlined"
                    :error-messages="Supplier.getSupplierErrors.mobileno[0] ? Supplier.getSupplierErrors.mobileno[0] : '' "
                    density="compact"
                    @blur="Supplier.ClearMobileNoError, Supplier.CheckMobileno(Supplier.editedSupplier)"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Address"
                    required
                    v-model.trim="Supplier.editedSupplier.addr"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="['B2B', 'B2C']"
                    label="Type"
                    variant="outlined"
                    v-model.trim="Supplier.editedSupplier.type"
                    required
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="Supplier.close()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :loading="Supplier.loadingSupplierCreate"
              :disabled="!Supplier.formSupplierCreate"
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
  import { useSupplier } from '../../../stores';
  const Supplier = useSupplier()
</script>