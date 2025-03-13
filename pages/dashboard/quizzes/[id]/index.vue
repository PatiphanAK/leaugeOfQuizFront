<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import QuestionCard from '~/components/Quiz/QuestionCard.vue';
import QuestionModal from '~/components/Quiz/QuestionModal.vue';
import { useQuestionModalStore } from '~/stores/Question/questionModal';
import {useQuiz }from '~/composables/Quiz/useQuiz';
import{ useQuestion }from '~/composables/Question/useQuestion';
import type { Question, Quiz } from '~/types/Quiz/quiz.interface';

const route = useRoute();
const quizId = Number(route.params.id);
const quiz = useQuiz();
const question = useQuestion();
const modalStore = useQuestionModalStore();

const quizData = ref<Quiz | null>(null);
const questions = ref<Question[]>([]);
const isLoading = ref(true);
const error = ref('');

// Fetch quiz details and questions
const fetchQuizDetails = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    // Fetch quiz details
    const quizResponse = await quiz.getQuiz(quizId);
    quizData.value = quizResponse;
    
    // Fetch questions for this quiz
    const questionsResponse = await questionAPI.getQuestions(quizId);
    questions.value = questionsResponse;
  } catch (err: any) {
    error.value = 'Failed to load quiz details. Please try again later.';
    console.error('Error fetching quiz details:', err);
  } finally {
    isLoading.value = false;
  }
};

// Open modal to create a new question
const openCreateQuestionModal = () => {
  modalStore.setQuizId(quizId);
  modalStore.setCurrentQuestion(null);
  modalStore.toggleQuestionModal(true);
};

// Handle edit question
const handleEditQuestion = (question: Question) => {
  modalStore.setQuizId(quizId);
  modalStore.setCurrentQuestion(question);
  modalStore.toggleQuestionModal(true);
};

// Handle delete question
const handleDeleteQuestion = async (question: Question) => {
  if (!confirm('Are you sure you want to delete this question?')) return;
  
  try {
    await questionAPI.deleteQuestion(question.ID);
    // Remove the deleted question from the list
    questions.value = questions.value.filter(q => q.ID !== question.ID);
  } catch (err: any) {
    error.value = 'Failed to delete question. Please try again.';
    console.error('Error deleting question:', err);
  }
};

// Refresh questions after modal closed (for both create and edit)
watch(() => modalStore.isToggleQuestion, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    // Modal was just closed, refresh questions
    fetchQuizDetails();
  }
});

// Fetch data on component mount
onMounted(() => {
  fetchQuizDetails();
});

definePageMeta({
  layout: 'dashboard-layout',
  title: 'Quiz Details',
  useLayoutProps: true
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="container mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>
      
      <!-- Quiz Details -->
      <div v-else-if="quizData">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{{ quizData.Title }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">{{ quizData.Description }}</p>
          </div>
          
          <div class="flex space-x-4">
            <NuxtLink :to="`/dashboard/quizzes/edit/${quizId}`" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Edit Quiz
            </NuxtLink>
            <button 
              @click="openCreateQuestionModal" 
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Question
            </button>
          </div>
        </div>
        
        <!-- Questions Section -->
        <div class="mt-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Questions</h2>
          
          <!-- Empty Questions State -->
          <div v-if="questions.length === 0" class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No Questions Added</h3>
            <p class="mt-1 text-gray-500 dark:text-gray-400">Add questions to start building your quiz.</p>
            <button @click="openCreateQuestionModal" class="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Add First Question
            </button>
          </div>
          
          <!-- Question Cards -->
          <QuestionCard 
            v-else
            :questions="questions" 
            @edit="handleEditQuestion" 
            @delete="handleDeleteQuestion"
          />
        </div>
      </div>
    </div>
    
    <!-- Question Modal Component -->
    <QuestionModal />
  </div>
</template>