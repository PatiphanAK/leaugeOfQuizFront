<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useQuiz from "~/composables/Quiz/useQuiz";
import type { Quiz } from "@/types/Quiz/quiz.interface";
import QuizBaseForm from '~/components/Quiz/QuizBaseForm.vue';

const route = useRoute();
const router = useRouter();
const quizAPI = useQuiz();

const quiz = ref<Quiz | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  if (!route.params.id) {
    router.push('/dashboard/quizzes');
    return;
  }
  
  try {
    isLoading.value = true;
    const quizId = Number(route.params.id);
    const result = await quizAPI.fetchQuizById(quizId);
    
    if (result) {
      quiz.value = result;
      console.log("Quiz loaded for edit:", quiz.value);
    } else {
      error.value = 'Quiz not found';
    }
  } catch (err) {
    console.error('Error fetching quiz:', err);
    error.value = 'An error occurred while loading the quiz';
  } finally {
    isLoading.value = false;
  }
});

const handleCancel = () => {
  router.push(`/dashboard/quizzes/${route.params.id}`);
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md my-4">
      <p>{{ error }}</p>
      <button 
        @click="router.push('/dashboard/quizzes')" 
        class="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
      >
        Return to Quizzes
      </button>
    </div>
    
    <!-- Quiz Form -->
    <template v-else-if="quiz">
      <QuizBaseForm
        :initialQuiz="quiz"
        @cancel="handleCancel"
      />
    </template>
  </div>
</template>