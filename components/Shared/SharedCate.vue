<template>
    <div class="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl" :class="category.color">
        {{ category.icon }}
      </div>
      <h3 class="text-gray-900 font-medium">{{ category.name }}</h3>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    category: {
      type: Object,
      required: true
    }
  });
  </script>