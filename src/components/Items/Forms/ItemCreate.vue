<template>
  <v-row justify="center">
    <v-dialog v-model="Item.ItemCreateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn color="blue-accent-3" variant="flat" rounded="lg" v-bind="props">
          Create Item
        </v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="New Item">
        <v-form v-model="Item.formItemCreate" @submit.prevent="Item.creatingItem()">
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="Item Name"
                    required
                    v-model.trim="Item.editedItem.name"
                    :rules="[Item.rules.required]"
                    variant="outlined"
                    :error-messages="Item.getItemErrors.name[0] ? Item.getItemErrors.name[0] : ''"
                    @blur="Item.ClearItemNameError, Item.CheckItem(Item.editedItem)"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Description"
                    required
                    v-model.trim="Item.editedItem.description"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="['Current Asset', 'Fixed Asset']"
                    label="Type"
                    variant="outlined"
                    v-model.trim="Item.editedItem.type"
                    required
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="Item.close()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :loading="Item.loadingItemCreate"
              :disabled="!Item.formItemCreate"
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
  import { useItem } from '../../../stores';
  const Item = useItem()
</script>