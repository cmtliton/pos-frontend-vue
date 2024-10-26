<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { userType } from '../../Types/userTypes';
  import { useUser } from './../../../stores'

  const User = useUser()
  const router = useRouter();
  let CompanyProfile = ref<userType>({})

  function reDirectToSignIn () {
    router.push('/SignIn')
    }
    
  const CreateProfile = () => {
    if(!User.formUserCreate) return 
    User.loadingUserCreate = true
    User.CreateProfile(CompanyProfile.value)
  }

</script>

<template>
  <v-layout>
    <v-container>
      <v-card
        class="mx-auto mt-5"
        width="400"
        rounded="lg"
        prepend-icon="mdi-account"
        title="PROFILE REGISTRATION"
      >
        <v-divider></v-divider>
        <v-form v-model="User.formUserCreate" @submit.prevent="CreateProfile()">
          <v-container>
            <v-text-field
              v-model="CompanyProfile.name"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required]"
              color="primary"
              label="Company Name"
              placeholder="Assisthem"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="CompanyProfile.username"
              :readonly="User.loadingUserCreate"
              :error-messages="User.getAuthError.username[0] ? User.getAuthError.username[0]: ''"
              @blur="User.ClearUsernameAuthError, User.CheckUsername(CompanyProfile)"
              :rules="[User.rules.required, User.rules.email]"
              color="primary"
              label="Username"
              placeholder="cmtliton@gmail.com"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="CompanyProfile.password"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required, User.rules.min]"
              color="primary"
              label="Password"
              :append-inner-icon="User.visiblePassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="User.visiblePassword ? 'text' : 'password'"
              @click:append-inner="User.visiblePassword = !User.visiblePassword"
              placeholder="············"
              variant="outlined"
              density="compact"
              :error-messages="User.getAuthError.password[0] ? User.getAuthError.password[0]: ''"
              @blur="User.ClearPasswordAuthError"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="CompanyProfile.password_confirmation"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required, User.rules.min]"
              color="primary"
              label="Confirm Password"
              :append-inner-icon="User.visibleConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="User.visibleConfirmPassword ? 'text' : 'password'"
              @click:append-inner="User.visibleConfirmPassword = !User.visibleConfirmPassword"
              placeholder="············"
              variant="outlined"
              density="compact"
              :error-messages="User.getAuthError.password[1] ? User.getAuthError.password[1] : ''"
              @blur="User.ClearPasswordAuthError, User.MatchingPasswordConfirmation(CompanyProfile)"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="CompanyProfile.mobileno"
              :readonly="User.loadingUserCreate"
              :error-messages="User.getAuthError.mobileno[0] ? User.getAuthError.mobileno[0]: ''"
              @blur="User.ClearMobileNoAuthError, User.CheckMobileno(CompanyProfile)"
              :rules="[User.rules.required]"
              color="primary"
              label="Mobile Number"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="CompanyProfile.addr"
              :readonly="User.loadingUserCreate"
              :rules="[User.rules.required]"
              color="primary"
              label="Address"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

          </v-container>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              :loading="User.loadingUserCreate"
              :disabled="!User.formUserCreate"
              type="submit"
              color="blue"
              size="large"
              variant="elevated"
            >
              Save
            </v-btn>
            <v-btn color="success" @click="reDirectToSignIn()">
              Already Profile?
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </v-layout>
</template>