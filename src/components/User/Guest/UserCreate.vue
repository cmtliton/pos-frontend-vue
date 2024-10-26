<template>
  <v-row justify="center">
    <v-dialog v-model="User.UserCreateDialog" persistent max-width="720px">
      <template v-slot:activator="{ props }">
        <v-btn color="blue-accent-3" variant="flat" rounded="lg" v-bind="props">
          Create User
        </v-btn>
      </template>
      <v-card prepend-icon="mdi-account" title="New User">
        <v-form v-model="User.formUserCreate" @submit.prevent="User.onCreateUser()">
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
                    label="User Name"
                    required
                    v-model.trim="User.editedUser.username"
                    :rules="[User.rules.required, User.rules.email]"
                    variant="outlined"
                    :error-messages="User.getAuthError.username[0] ? User.getAuthError.username[0]: ''"
                    density="compact"
                    placeholder="cmtliton@gmail.com"
                    @blur="User.ClearUsernameAuthError, User.CheckUsername(User.editedUser)"
                  ></v-text-field>
                </v-col>

              <v-col cols="12" sm="6">
              <v-text-field
              v-model="User.editedUser.password"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required, User.rules.min]"
              color="primary"
              label="Password"
              :append-inner-icon="User.visiblePassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="User.visiblePassword ? 'text' : 'password'"
              @click:append-inner="User.visiblePassword = !User.visiblePassword"
              placeholder="Enter your password"
              variant="outlined"
              :error-messages="User.getAuthError.password[0] ? User.getAuthError.password[0] : ''"
              @blur="User.ClearPasswordAuthError"
              density="compact"
            ></v-text-field>
                </v-col>

         <v-col cols="12" sm="6">
           <v-text-field
              v-model="User.editedUser.password_confirmation"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required, User.rules.min]"
              color="primary"
              label="Confirm Password"
              :append-inner-icon="User.visibleConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="User.visibleConfirmPassword ? 'text' : 'password'"
              @click:append-inner="User.visibleConfirmPassword = !User.visibleConfirmPassword"
              placeholder="Confirm Password?"
              variant="outlined"
              :error-messages="User.getAuthError.password[1] ? User.getAuthError.password[1] : ''"
              density="compact"
              @blur="User.ClearPasswordAuthError, User.MatchingPasswordConfirmation(User.editedUser)"
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
                    density="compact"
                    @blur="User.ClearMobileNoAuthError, User.CheckMobileno(User.editedUser)"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
    v-model="User.editedUser.role"
    :items="User.getRoles"
    item-title="name"
    item-value="id"
    label="User Role"
    variant="outlined"
    return-object
    single-line
    density="compact"
  ></v-select>
                </v-col>
                <v-col cols="12">
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
            <v-btn color="blue-darken-1" variant="text" @click="User.close()">
              Close
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="elevated"
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
 import { useUser } from './../../../stores'
const User = useUser()
</script>
