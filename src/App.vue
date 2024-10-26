<script setup lang="ts">
  import { onMounted } from "vue"
  import { useRouter } from 'vue-router'
  import { RouterView } from "vue-router"
  import { useUser } from "./stores"
  import Tabs from "./components/Layout/AppLayout.vue"
  const user = useUser()
  const Router = useRouter()
  
  onMounted(()=>{
    user.LoadCmpProfile()
    user.onRetrieveUser()
    Router.push('/')
  })
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-card class="mx-auto" flat>
      <Tabs v-if="user.loggedIn"/>
      <v-main
        class="d-flex align-center justify-center"
        style="min-height: 300px"
      >
        <router-view></router-view>
      </v-main>
    </v-card>
  </v-layout>
</template>