<template>
</template>

<script  setup lang="ts">
import {onMounted } from 'vue';
import useAuth from '../../../composables/useAuth';
const {Logout} = useAuth();

onMounted(()=> {
  //user.CheckSignIn({})
  Logout()
})
</script>
