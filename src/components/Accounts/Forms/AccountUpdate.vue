<template>
  <v-row justify="center">
    <v-dialog v-model="Account.AccountUpdateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-pencil"
          size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="updatingAccount()"
        ></v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="Edit Account">
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
                    :item-props="Account_TypeByName"
                    :items="Account.getAccount_types"
                    item-value="id"
                    label="Type"
                    variant="outlined"
                    required
                    density="compact"
                    clearable
                    auto-select-first
                    :rules="[Account.rules.required]"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="Account.closeUpdateAccountDialog()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              type="submit"
              :disabled="!Account.formAccountCreate"
              :loading="Account.loadingAccountCreate"
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
    import { useAccount } from './../../../stores'
    import { accountType, account_typeType } from '../../Types/productTypes';

    let AccountFrmAccounts = defineProps({
      category: Object as PropType<accountType>
    })

    const Account = useAccount()


    function Account_TypeByName(item: account_typeType) {
    return { title: item.name}
  }

  function updatingAccount() {
    Account.editedAccount = Object.assign({}, AccountFrmAccounts.category)
    let index = Account.Accounts.find((itm)=> itm.name?.toLowerCase() == Account.editedAccount.name?.toLowerCase())
    if(index !== undefined) {
      Account.editedIndex = Account.Accounts.indexOf(index)
    }
  }
</script>