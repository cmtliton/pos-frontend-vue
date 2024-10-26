<script setup lang="ts">
import { PropType, computed } from 'vue';
import OrderTerm from './OrderTerm';
import {Job} from './type'
const props = defineProps({
    Jobs: {
            type: Array as PropType<Job[]>,
            required: true
        },
    order: {
        type: String as PropType<OrderTerm>,
        required: true
    }
})
const orderJobs = computed(() => {
    return [...props.Jobs].sort((a: Job, b: Job) => {
        return a[props.order] > b[props.order] ? 1 : -1
    })
})
</script>

<template>
    <v-container class="mt-1 bg-pink-darken-2">
        <p>Orderby {{ order }}</p>
        <transition-group name="list">
    <v-card v-for="JB in orderJobs" :key="JB.id" class="xs ma-3 bg-gray-darken-3">
        <v-card-title>{{ JB.title }}</v-card-title>
        <v-card-subtitle>{{ JB.location }}</v-card-subtitle>
        <v-card-text>{{ JB.salary }}</v-card-text>
        </v-card>
        </transition-group>
        </v-container>
</template>
<style scoped>
.list-move {
    transition: all 1s
}
</style>