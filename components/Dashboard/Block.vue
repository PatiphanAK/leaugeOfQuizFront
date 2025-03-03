<script lang="ts" setup>
import { NuxtLink } from '#components'

// กำหนด props ที่ component นี้รับเข้ามา
interface Props {
  items: {
    title: string;
    description: string;
    link: string;
  }[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    <template v-for="(item, index) in props.items" :key="index">
      <NuxtLink :to="item.link">
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-transform transform hover:scale-105">
          <h3 class="font-medium mb-2 dark:text-white">{{ item.title }}</h3>
          <p class="text-gray-600 dark:text-gray-300">{{ item.description }}</p>
        </div>
      </NuxtLink>
    </template>
  </div>
</template>