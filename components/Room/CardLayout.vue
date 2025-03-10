<script lang="ts" setup>
import CardRoom from './CardRoom.vue';
import type { Quiz } from '~/types/Quiz/quiz.interface';

// Change the props definition to accept an array of Quiz objects
const props = defineProps<{
  quizzes: Quiz[]
}>();
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-3xl font-bold mb-6">All Quizzes</h1>
    
    <!-- If no quizzes are available -->
    <div v-if="!quizzes || quizzes.length === 0" class="text-center py-10">
      <p class="text-gray-500 dark:text-gray-400">No quizzes available at the moment.</p>
    </div>
    
    <!-- Grid layout for quiz cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="quiz in quizzes" :key="quiz.ID">
        <CardRoom :quiz="quiz" />
      </div>
    </div>
  </div>
</template>
