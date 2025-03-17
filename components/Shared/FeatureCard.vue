<template>
    <div class="bg-gray-50 p-8 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
      <div class="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
        <slot name="icon"></slot>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3">{{ title }}</h3>
      <p class="text-gray-600">{{ description }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  });
  </script>