<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useQuiz from "~/composables/Quiz/useQuiz";
import type { Quiz } from "@/types/Quiz/quiz.interface";
import QuestionCard from '~/components/Quiz/QuestionCard.vue';
import { Helper } from '@/utils/helper';

const route = useRoute();
const router = useRouter();
const quizAPI = useQuiz();
const helper = new Helper();

const quiz = ref<Quiz | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
// Removed the showAnswers ref since we want to show all answers all the time

// Computed property to determine if the quiz has a cover image
const hasCoverImage = computed(() => {
  return quiz.value?.ImageURL && quiz.value.ImageURL.trim() !== '';
});

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
      console.log("Quiz loaded for detail view:", quiz.value);
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

// Navigation and action handlers
const navigateToEdit = () => {
  router.push(`/dashboard/quizzes/${route.params.id}/edit`);
};

const deleteQuizConfirm = async () => {
  if (!quiz.value) return;
  
  if (confirm(`Are you sure you want to delete "${quiz.value.Title}"?`)) {
    try {
      isLoading.value = true;
      const result = await quizAPI.deleteQuiz(quiz.value.ID);
      
      if (result) {
        router.push('/dashboard/quizzes');
      } else {
        error.value = 'Failed to delete quiz';
      }
    } catch (err) {
      console.error('Error deleting quiz:', err);
      error.value = 'An error occurred while deleting the quiz';
    } finally {
      isLoading.value = false;
    }
  }
};

// Removed the toggleShowAnswers function since we don't need it anymore
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
    
    <!-- Quiz Display -->
    <div v-else-if="quiz" class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Quiz Header with Image -->
      <div class="relative" :class="{ 'h-60': hasCoverImage }">
        <div v-if="hasCoverImage" class="w-full h-full">
          <img :src="helper.getHttp(quiz.ImageURL)" alt="Quiz cover" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div class="p-6" :class="{ 'absolute bottom-0 w-full text-white': hasCoverImage }">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold">{{ quiz.Title }}</h1>
              <div class="flex items-center mt-2 flex-wrap gap-2">
                <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded" :class="{ 'bg-opacity-50': hasCoverImage }">
                  {{ quiz.TimeLimit }} seconds
                </span>
                <span v-if="quiz.IsPublished" class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded" :class="{ 'bg-opacity-50': hasCoverImage }">
                  Published
                </span>
                <span v-else class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded" :class="{ 'bg-opacity-50': hasCoverImage }">
                  Draft
                </span>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <button 
                @click="navigateToEdit" 
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button 
                @click="deleteQuizConfirm" 
                class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quiz Content -->
      <div class="p-6">
        <!-- Description -->
        <div class="mb-8">
          <h2 class="text-lg font-medium mb-2">Description</h2>
          <p class="text-gray-700">{{ quiz.Description || 'No description provided.' }}</p>
        </div>
        
        <!-- Categories -->
        <div v-if="quiz.Categories && quiz.Categories.length > 0" class="mb-8">
          <h2 class="text-lg font-medium mb-2">Categories</h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="category in quiz.Categories" 
              :key="category.ID" 
              class="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full"
            >
              {{ category.Name }}
            </span>
          </div>
        </div>
        
        <!-- Questions Section -->
        <div v-if="quiz.Questions && quiz.Questions.length > 0" class="mb-8">
          <div class="mb-4">
            <h2 class="text-lg font-medium">Questions ({{ quiz.Questions.length }})</h2>
          </div>
          
          <!-- Pass questions to QuestionCard with showCorrectAnswers set to false -->
          <QuestionCard 
            :questions="quiz.Questions" 
            :showCorrectAnswers="false"
          />
        </div>
        
        <!-- No Questions Message -->
        <div v-else class="mb-8 p-4 bg-yellow-50 text-yellow-700 rounded-md">
          <p>This quiz doesn't have any questions yet. Click the Edit button to add questions.</p>
        </div>
      </div>
    </div>
  </div>
</template>