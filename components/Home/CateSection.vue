<template>
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">หมวดหมู่ยอดนิยม</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">ค้นพบหมวดหมู่ที่น่าสนใจและเลือกควิซที่ตรงกับความต้องการของคุณ</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <SharedCate
            v-for="(category, index) in categories" 
            :key="index" 
            :category="category"
            @click="$emit('categorySelected', category)"
          />
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import SharedCate from '../Shared/SharedCate.vue';
  
  const categories = ref([
    { name: 'วิทยาศาสตร์', icon: '🔬', color: 'bg-blue-500' },
    { name: 'คณิตศาสตร์', icon: '🧮', color: 'bg-green-500' },
    { name: 'ประวัติศาสตร์', icon: '🏛️', color: 'bg-amber-500' },
    { name: 'ภาษาอังกฤษ', icon: '🔤', color: 'bg-purple-500' },
    { name: 'เทคโนโลยี', icon: '💻', color: 'bg-indigo-500' },
    { name: 'กีฬา', icon: '⚽', color: 'bg-red-500' },
  ]);
  
  defineEmits(['categorySelected']);
  </script>