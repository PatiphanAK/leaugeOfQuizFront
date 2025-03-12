<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import QuizLayout from '~/components/Quiz/QuizLayout.vue';
import useQuiz from '~/composables/Quiz/useQuiz';
import SearchBar from '~/components/Base/SearchBar.vue';
import Pagination from '~/components/Base/Pagination.vue';
import type { Quiz } from '~/types/Quiz/quiz.interface';
import Sidebar from '~/components/Base/Sidebar.vue';

const quiz = useQuiz();
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(true);


const quizzes = ref<Quiz[]>([]);
const error = ref('');
const searchTerm = ref('');

const fetchQuizzes = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await quiz.fetchQuizAll({
      limit: 10,
      page: (currentPage.value - 1) * 10,
      search: searchTerm.value
    });
    
    quizzes.value = response.data;
    totalPages.value = Math.ceil(response.meta.total / 10);
  } catch (err) {
    error.value = 'Failed to load quizzes. Please try again later.';
    console.error('Error fetching quizzes:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async (term: string) => {
  searchTerm.value = term;
  currentPage.value = 1; // Reset to first page when searching
  await fetchQuizzes();
};

const handlePreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Watch for changes in currentPage to fetch new data
watch(currentPage, () => {
  fetchQuizzes();
});

// Fetch quizzes when component is mounted
onMounted(() => {
  fetchQuizzes();
});

definePageMeta({
  layout: "dashboard-layout",
});

</script>

<template>
  <div class="quiz-index-container min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Quiz Collection</h1>
      <!-- Search Bar Component -->
      <div class="mb-8">
        <SearchBar @search="handleSearch" />
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="quizzes.length === 0" class="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No Quizzes Found</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or check back later for new quizzes.</p>
        <button @click="fetchQuizzes" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Refresh
        </button>
      </div>
      
      <!-- Quiz Layout Component -->
      <div v-else>
        <QuizLayout :quizzes="quizzes" />
        
        <!-- Pagination -->
        <div class="mt-8 flex justify-center">
          <Pagination 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            @previous="handlePreviousPage" 
            @next="handleNextPage" 
          />
        </div>
      </div>
      
      <!-- Create Quiz Button -->
      <div class="mt-12 text-center">
        <NuxtLink to="/dashboard/quizzes/create" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create New Quiz
        </NuxtLink>
      </div>
    </div>
  </div>
</template>