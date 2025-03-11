<script lang="ts" setup>
import CardRoom from './CardRoom.vue';
import type { Quiz } from '~/types/Quiz/quiz.interface';

const props = defineProps<{
  quizzes: Quiz[]
}>();
</script>

<template>
  <div class="container mx-auto">
    <!-- Grid layout for quiz cards with better spacing and responsive design -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="quiz in quizzes" :key="quiz.ID" class="quiz-card-wrapper transform transition duration-300 hover:scale-105">
        <CardRoom :quiz="quiz" />
      </div>
    </div>
  </div>
</template>