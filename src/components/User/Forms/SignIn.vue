<template>
  <v-container>
    <v-card class="mx-auto px-6 py-8 mt-8" width="380" rounded="lg">
      <v-sheet class="d-flex mb-3">
        <v-alert v-if ="User.getError !== 'Blank'" density="compact" :type='errorColor' :text='User.getError'/>
      </v-sheet>
      <v-form v-model="User.formUserCreate" @submit.prevent="onSubmit">
        <v-text-field
          v-model="UserForSign.username"
          :readonly="User.loadingUserCreate"
          :rules="[User.rules.required, User.rules.email]" 
          class="mb-2"
          clearable
          label="Username"
          color="primary"
          placeholder="cmtliton@gmail.com"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="UserForSign.password"
          :readonly="User.loadingUserCreate"
          :rules="[User.rules.required]"
          :append-inner-icon="User.visiblePassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="User.visiblePassword ? 'text' : 'password'"
          @click:append-inner="User.visiblePassword = !User.visiblePassword"
          label="Password"
          placeholder="Enter your password"
          variant="outlined"
        ></v-text-field>

        <v-btn
          :disabled="!User.formUserCreate"
          :loading="User.loadingUserCreate"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Log In
        </v-btn>
        <v-card-text class="text-center">
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forgot login password?
          </a>
        </v-card-text>

        <v-btn
          block
          color="blue"
          size="large"
          variant="elevated"
          @click="CreateProfile()"
        >
        Create Profile
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script  setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUser, useItem } from './../../../stores'
import { userType } from '../../Types/userTypes';

const router = useRouter();
const User = useUser();
const Item = useItem();

const UserForSign = ref<userType>({})

function CreateProfile () {
  router.push('/CreateProfile')
}

const errorColor = computed(()=> {
  return User.getError == 'Please Create Profile or Login!' ? 'info' : 'error'
})
function onSubmit() {
  if(!User.formUserCreate) return
  User.onLogin(UserForSign.value)
}

onMounted(()=> {
  setTimeout(() => {
    if(!User.IsCmpLength) {
    router.push('/CreateProfile')
  }
  },15000)
if (!User.loggedIn) {
  Item.items = []
}
})
</script>
