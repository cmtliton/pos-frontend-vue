<template>
  <v-row justify="center">
    <v-dialog v-model="Buyer.BuyerCreateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn icon size="x-small" v-bind="props">
            <v-icon color="grey-lighten-1"> mdi-plus </v-icon>
    </v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="New Buyer">
        <v-form v-model="Buyer.formBuyerCreate" @submit.prevent="Buyer.creatingBuyer()">
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="Buyer Name"
                    required
                    v-model.trim="Buyer.editedBuyer.name"
                    :rules="[Buyer.rules.required]"
                    variant="outlined"
                    :error-messages="Buyer.getBuyerErrors.name[0] ? Buyer.getBuyerErrors.name[0] : ''"
                    @blur="Buyer.ClearBuyerNameError, Buyer.CheckBuyer(Buyer.editedBuyer)"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Mobile No."
                    required
                    :rules="[Buyer.rules.required]"
                    v-model.trim="Buyer.editedBuyer.mobileno"
                    variant="outlined"
                    :error-messages="Buyer.getBuyerErrors.mobileno[0] ? Buyer.getBuyerErrors.mobileno[0] : '' "
                    density="compact"
                    @blur="Buyer.ClearMobileNoError, Buyer.CheckMobileno(Buyer.editedBuyer)"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Address"
                    required
                    v-model.trim="Buyer.editedBuyer.addr"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                  :item-props="Buyer.getTypeByName"
                    :items="Buyer.getTypes"
                    item-value="type"
                    label="Type"
                    variant="outlined"
                    v-model.trim="Buyer.editedBuyer.type"
                    required
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="Buyer.close()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :loading="Buyer.loadingBuyerCreate"
              :disabled="!Buyer.formBuyerCreate"
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
  import { useBuyer } from '../../../stores';
  const Buyer = useBuyer()
</script>