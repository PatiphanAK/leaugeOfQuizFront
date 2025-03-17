<template>
    <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      <div class="h-48 overflow-hidden">
        <img :src="quiz.image" :alt="quiz.title" class="w-full h-full object-cover transition-all duration-500 transform hover:scale-105">
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ quiz.title }}</h3>
        <p class="text-gray-600 mb-4">{{ quiz.description }}</p>
        <div class="flex justify-between text-sm text-gray-500">
          <span>{{ quiz.questions }} คำถาม</span>
          <span>{{ quiz.players }} คนเล่นแล้ว</span>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button @click="$emit('play')" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    quiz: {
      type: Object,
      required: true
    },
    buttonText: {
      type: String,
      default: 'เริ่มเล่นเลย'
    }
  });
  
  defineEmits(['play']);
  </script>