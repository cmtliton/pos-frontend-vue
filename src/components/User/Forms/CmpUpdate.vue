<template>
  <v-row justify="center">
    <v-dialog v-model="User.UserUpdateDialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          class="ma-1 mt-3"
          flat
          v-bind="props"
          @click="UpdatingProfile()"
        ></v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="Edit Profile Registration">
        <v-form v-model="User.formUserCreate" @submit.prevent="User.onProfileUpdate()">
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
              v-model="User.editedUser.name"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required]"
              color="primary"
              label="Company Name"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="User.editedUser.mobileno"
              :readonly="User.loadingUserCreate"
              :error-messages="User.getAuthError.mobileno[0] ? User.getAuthError.mobileno[0]: ''"
              @blur="User.ClearMobileNoAuthError, User.CheckMobileno(User.editedUser)"
              :rules="[User.rules.required]"
              color="primary"
              label="Mobile Number"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="User.editedUser.addr"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required]"
              color="primary"
              label="Address"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="User.closeUpdateUserDialog()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              :loading="User.loadingUserCreate"
              variant="text"
              type="submit"
              :disabled="!User.formUserCreate"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
    import { PropType } from 'vue'
    import { useUser } from './../../../stores'
    import { userType } from '../../Types/userTypes';

    let itemFrmItems = defineProps({
      Cmp: Object as PropType<userType>
    })

    const User = useUser()


  function UpdatingProfile() {
    User.editedUser = Object.assign({}, itemFrmItems.Cmp)
    let index = User.CompanyProfile.find((cmp) => cmp.id == User.editedUser.id)
    if(index !== undefined) {
      User.editedIndex = User.CompanyProfile.indexOf(index)
    }
  }
</script>
