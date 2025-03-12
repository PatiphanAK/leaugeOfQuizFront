<script lang="ts" setup>
import type { Quiz } from '~/types/Quiz/quiz.interface';
import { computed } from 'vue';
import { NuxtLink } from '#components';
import { useRoute } from 'vue-router';
import { Helper } from '~/utils/helper';

const route = useRoute();
const helper = new Helper();

const props = defineProps<{
  quiz: Quiz
}>();

// สำหรับตัดข้อความให้สั้นลงถ้าข้อความยาวเกินไป
const truncatedDescription = computed(() => {
  if (!props.quiz.Description) return '';
  return props.quiz.Description.length > 100 
    ? props.quiz.Description.substring(0, 100) + '...' 
    : props.quiz.Description;
});

// ตรวจสอบรูปภาพ (fallback ถ้าไม่มี)
const imageUrl = computed(() => {
  return helper.getHttp(props.quiz.ImageURL) || 'https://picsum.photos/seed/' + props.quiz.ID + '/400/250';
});
</script>

<template>
  <div class="h-full bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
    <div class="relative">
      <img 
        class="w-full h-48 object-cover" 
        :src="imageUrl" 
        :alt="quiz.Title" 
        loading="lazy" 
      />
    </div>
    
    <div class="p-5 flex flex-col h-48">
      <NuxtLink :to="`${route.path}/${quiz.ID}`" class="mb-2">
        <h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          {{ quiz.Title }}
        </h5>
      </NuxtLink>
      
      <p class="mb-3 text-sm text-gray-700 dark:text-gray-400 flex-grow">
        {{ truncatedDescription }}
      </p>
      
      <div class="mt-auto flex items-center justify-between">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <span v-if="quiz.CreatedAt">
            {{ new Date(quiz.CreatedAt).toLocaleDateString('th-TH') }}
          </span>
        </div>
        
        <NuxtLink 
          :to="`${route.path}/${quiz.ID}`" 
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200"
        >
          สร้างห้อง
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>