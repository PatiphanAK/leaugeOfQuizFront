<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useQuiz from "~/composables/Quiz/useQuiz";
import type { Quiz } from "@/types/Quiz/quiz.interface";

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
      console.log('Quiz:', quiz.value);
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
    <div v-else-if="quiz" class="bg-white shadow rounded-lg">
      <!-- Quiz Header with Image -->
      <div class="relative">
        <div v-if="quiz.ImageURL" class="w-full h-60 overflow-hidden rounded-t-lg">
          <img :src="quiz.ImageURL" alt="Quiz cover" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div class="p-6" :class="{ 'absolute bottom-0 text-white': quiz.ImageURL }">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold">{{ quiz.Title }}</h1>
              <div class="flex items-center mt-2">
                <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded" :class="{ 'bg-opacity-50': quiz.ImageURL }">
                  {{ quiz.TimeLimit }} seconds
                </span>
                <span v-if="quiz.IsPublished" class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded" :class="{ 'bg-opacity-50': quiz.ImageURL }">
                  Published
                </span>
                <span v-else class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded" :class="{ 'bg-opacity-50': quiz.ImageURL }">
                  Draft
                </span>
              </div>
            </div>
            
            <div class="flex space-x-2">
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
          <p class="text-gray-700">{{ quiz.Description }}</p>
        </div>
        
        <!-- Categories -->
        <div v-if="quiz.Categories && quiz.Categories.length > 0" class="mb-8">
          <h2 class="text-lg font-medium mb-2">Categories</h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="category in quiz.Categories" 
              :key="typeof category === 'object' ? category.ID : category" 
              class="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full"
            >
              {{ typeof category === 'object' ? category.Name : category }}
            </span>
          </div>
        </div>
        
        <!-- Questions Preview -->
        <div class="mb-8">
          <h2 class="text-lg font-medium mb-4">Questions ({{ quiz.Questions.length }})</h2>
          
          <div v-for="(question, questionIndex) in quiz.Questions" :key="question.id" class="mb-6 border border-gray-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="bg-indigo-100 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1">
                {{ questionIndex + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-medium mb-2">{{ question.text }}</h3>
                
                <!-- Question Image -->
                <div v-if="question.imageURL" class="mb-3">
                  <img :src="question.imageURL" alt="Question image" class="h-40 object-contain rounded-md" />
                </div>
                
                <!-- Choices -->
                <ul class="space-y-2">
                  <li 
                    v-for="(choice, choiceIndex) in question.choices" 
                    :key="choice.id" 
                    class="flex items-start p-2 rounded-md" 
                    :class="{ 'bg-green-50 border border-green-200': choice.isCorrect }"
                  >
                    <div class="flex-shrink-0 mr-2">
                      <div class="w-5 h-5 rounded-full border flex items-center justify-center" :class="choice.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'">
                        <svg v-if="choice.isCorrect" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <span :class="{ 'font-medium': choice.isCorrect }">{{ choice.text }}</span>
                      
                      <!-- Choice Image -->
                      <div v-if="choice.imageURL" class="mt-2">
                        <img :src="choice.imageURL" alt="Choice image" class="h-24 object-contain rounded-md" />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>