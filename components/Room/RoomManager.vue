<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import useQuiz from '~/composables/Quiz/useQuiz';

import Pagination from '~/components/Base/Pagination.vue';
import SearchBar from '~/components/Base/SearchBar.vue';
import CardLayout from '~/components/Room/CardLayout.vue';
import type { Quiz } from '~/types/Quiz/quiz.interface';

const quiz = useQuiz();
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(true);
const pageSize = ref(12); // เพิ่มตัวแปรสำหรับจำนวนรายการต่อหน้า


const quizzes = ref<Quiz[]>([]);
const error = ref('');
const searchTerm = ref('');

const fetchQuizzes = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await quiz.fetchQuizAll({
      limit: pageSize.value,
      page: currentPage.value, // ส่งหมายเลขหน้าโดยตรง
      search: searchTerm.value
    });
    
    quizzes.value = response.data;
    totalPages.value = Math.ceil(response.meta.total / pageSize.value); // คำนวณจำนวนหน้าทั้งหมด
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูล quiz ได้ กรุณาลองอีกครั้งในภายหลัง';
    console.error('Error fetching quizzes:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async (term: string) => {
  searchTerm.value = term;
  currentPage.value = 1; // รีเซ็ตกลับไปหน้าแรกเมื่อค้นหา
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

// ไปยังหน้าที่ระบุ
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
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
</script>

<template>
  <div class="quiz-index-container min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">คลังข้อสอบ Quiz</h1>
      
      <!-- Search Bar Component -->
      <div class="mb-8">
        <SearchBar @search="handleSearch" placeholder="ค้นหา quiz ที่ต้องการ..." />
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">ผิดพลาด!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="quizzes.length === 0" class="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">ไม่พบ Quiz</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">ลองปรับเปลี่ยนคำค้นหาหรือกลับมาตรวจสอบอีกครั้งในภายหลัง</p>
        <button @click="fetchQuizzes" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          รีเฟรช
        </button>
      </div>
      
      <!-- Quiz Layout Component -->
      <div v-else>
        <CardLayout :quizzes="quizzes" />
        
        <!-- Pagination -->
        <div class="mt-8 flex justify-center">
          <Pagination 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            @previous="handlePreviousPage" 
            @next="handleNextPage"
            @go-to-page="goToPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>