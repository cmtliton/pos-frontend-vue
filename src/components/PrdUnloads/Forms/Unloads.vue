<script setup lang="ts">
import { ref } from 'vue'
import {Job} from './type'
import OrderTerm from './OrderTerm';
import JobList from './JobList.vue';
const Jobs = ref<Job[]>([
    { title: 'Farm Worker', location: 'Dhaka, Bangladesh', salary: 50000, id: '1'},
    { title: 'Jabon Worker', location: 'Nepal, Bangladesh', salary: 10000, id: '2' },
    { title: 'Sufala Worker', location: 'Rajshahi, Bangladesh', salary: 40000, id: '3' },
    { title: 'Talk Worker', location: 'Bogura, Bangladesh', salary: 20000, id: '4' },
    { title: 'Farm Worker', location: 'Dhaka, Bangladesh', salary: 80000, id: '5' },
    { title: 'Shamo Worker', location: 'Cummilla, Bangladesh', salary: 60000, id: '6' },
    { title: 'Shumon Worker', location: 'Dhaka, Bangladesh', salary: 50000, id: '7' }
])
const order = ref<OrderTerm>('title')

const handleClick = (term: OrderTerm ) => {
    order.value = term
}
</script>

<template>
    <div>
        <h1>Liton Jobs</h1>
        <v-btn color="primary" @click="handleClick('title')" class="ml-2">order by title</v-btn>
        <v-btn color="secondary" @click="handleClick('location')" class="ml-2">order by location</v-btn>
        <v-btn color="primary" @click="handleClick('salary')" class="ml-2">order by salary</v-btn>
   <JobList :Jobs="Jobs" :order="order"/>
   </div>
</template>