<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUser, useItem, useBrand } from './../../stores'
const User = useUser()
const Item = useItem()
const txt = ref('মাত্র তিন বছরের ব্যবধান। এর মধ্যে ব্যক্তিগত আয়, গাড়ি, নগদ টাকা, ব্যাংকসহ অন্যান্য আর্থিক প্রতিষ্ঠানে জমা রাখা টাকা—সবকিছুই বেড়ে গেছে ঢাকা-১৮ আসনের আওয়ামী লীগের সংসদ সদস্য মোহাম্মদ হাবিব হাসানের। আসন্ন দ্বাদশ জাতীয় সংসদ নির্বাচনে আওয়ামী লীগের মনোনীত প্রার্থী হিসেবে অংশ নিতে নির্বাচন কমিশনে তাঁর দেওয়া হলফনামায় এ তথ্য উঠে ')
onMounted(()=> {
  const cmpid: string | undefined = User.getUser.company_id? User.getUser.company_id : User.user.company_id
       if(cmpid !== undefined && User.getUsers.length<2) {
        User.LoadUsers(cmpid)
       }
  if (Item.getItems.length < 2) {
    Item.loadingItems(cmpid)
    useBrand().loadingBrands(cmpid)
  }
})
</script>

<template>
  <v-row align="center" justify="center" class="mt-9">
    <v-col cols="auto">
      <v-card
        class="mx-auto"
        max-width="344"
        title="Icons"
        subtitle="আয়, গাড়ি, নগদ ও ব্যাংকের টাকা—সব বেড়েছে হাবিব হাসানের"
        prepend-icon="mdi-account"
        append-icon="mdi-check"
      >
        <v-card-text align="justify">{{txt}}</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="auto">
      <v-card
        class="mx-auto"
        max-width="344"
        title="Icons"
        subtitle="prepend and append"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-account" color="primary"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon icon="mdi-check" color="success"></v-icon>
        </template>
        <v-card-text align="justify">{{txt}}</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="auto">
      <v-card
        class="mx-auto"
        max-width="344"
        title="Avatars"
        subtitle="prepend-avatar and append-avatar"
        prepend-avatar="https://cdn.vuetifyjs.com/images/logos/v-alt.svg"
        append-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
      >
        <v-card-text align="justify">{{txt}}</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="auto">
      <v-card
        class="mx-auto mt-1 mb-1"
        max-width="344"
        title="Avatars"
        subtitle="prepend and append"
      >
        <template v-slot:prepend>
          <v-avatar color="blue-darken-2">
            <v-icon icon="mdi-alarm"></v-icon>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-avatar size="24">
            <v-img
              src="https://cdn.vuetifyjs.com/images/john.png"
              alt="John"
            ></v-img>
          </v-avatar>
        </template>
        <v-card-text align="justify">{{txt}}</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="auto">
      <v-card
        class="mx-auto"
        max-width="344"
        title="Avatars"
        subtitle="prepend and append"
      >
        <template v-slot:prepend>
          <v-avatar color="blue-darken-2">
            <v-icon icon="mdi-alarm"></v-icon>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-avatar size="24">
            <v-img
              src="https://cdn.vuetifyjs.com/images/john.png"
              alt="John"
            ></v-img>
          </v-avatar>
        </template>
        <v-card-text align="justify">{{txt}}</v-card-text>
      </v-card>
    </v-col>

    <v-col cols="auto">
      <v-card
        class="mx-auto"
        max-width="344"
        title="Icons"
        subtitle="আয়, গাড়ি, নগদ ও ব্যাংকের টাকা—সব বেড়েছে হাবিব হাসানের"
        prepend-icon="mdi-account"
        append-icon="mdi-check"
      >
        <v-card-text align="justify">{{txt}}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>