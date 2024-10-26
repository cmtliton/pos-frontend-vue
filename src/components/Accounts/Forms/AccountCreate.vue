<template>
  <v-row justify="center">
    <v-dialog v-model="Account.AccountCreateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn color="blue-accent-3" variant="flat" rounded="lg" v-bind="props">
          Create Account
        </v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="New Account">
        <v-form v-model="Account.formAccountCreate" @submit.prevent="Account.creatingAccount()">
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="Account Name"
                    required
                    v-model.trim="Account.editedAccount.name"
                    :rules="[Account.rules.required]"
                    variant="outlined"
                    :error-messages="Account.getAccountErrors.name[0] ? Account.getAccountErrors.name[0] : ''"
                    @blur="Account.ClearAccountNameError, Account.CheckAccount(Account.editedAccount)"
                    density="compact"
                    placeholder="Purchase..."
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Description"
                    required
                    v-model.trim="Account.editedAccount.description"
                    variant="outlined"
                    :error-messages="''"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                  v-model.number = "Account.editedAccount.account_type_id"
                  :item-props="AccountTypeByName"
                    :items="Account.getAccount_types"
                    item-value="id"
                    label="Type"
                    variant="outlined"
                    required
                    density="compact"
                    clearable
                    auto-select-first
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="Account.close()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :loading="Account.loadingAccountCreate"
              :disabled="!Account.formAccountCreate"
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
  import { useAccount } from '../../../stores';
  import { account_typeType } from '../../Types/productTypes';
  const Account = useAccount()

  function AccountTypeByName(item: account_typeType) {
    return { title: item.name}
  }
</script>