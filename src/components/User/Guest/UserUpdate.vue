<template>
  <v-row justify="center">
    <v-dialog v-model="User.UserUpdateDialog" persistent max-width="700px">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-pencil" size="x-small" class="ma-2 pa-2" flat
          v-bind="props"
          @click="UpdateUser()"
        ></v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="Edit User">
        <v-form v-model="User.formUserCreate" @submit.prevent="User.UpdatingUser()">
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Name"
                    required
                    v-model.trim="User.editedUser.name"
                    :rules="[User.rules.required]"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Mobile No."
                    required
                    v-model.trim="User.editedUser.mobileno"
                    :rules="[User.rules.required]"
                    variant="outlined"
                    :error-messages="User.getAuthError.mobileno[0] ? User.getAuthError.mobileno[0] : '' "
                    @blur="User.ClearMobileNoAuthError, User.CheckMobileno(User.editedUser)"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="User.getRoles"
                    label="User Role"
                    variant="outlined"
                    v-model="User.editedUser.role"
                    required
                    density="compact"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Address"
                    required
                    v-model.trim="User.editedUser.addr"
                    :rules="[User.rules.required]"
                    variant="outlined"
                    density="compact"
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
              variant="text"
              type="submit"
              :loading="User.loadingUserCreate"
              :disabled="!User.formUserCreate"
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
    import { useUser } from './../../../stores'
    import { userType } from '../../Types/userTypes';

    let userFrmUsers = defineProps({
      user: Object as PropType<userType>
    })

    const User = useUser()


  function UpdateUser() {
    User.editedUser = Object.assign({}, userFrmUsers.user)
    let index = User.users.find((user)=> user.id == User.editedUser.id)
    if(index !== undefined) {
      User.editedIndex = User.users.indexOf(index)
    }
  }
</script>
