<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import QuestionCard from '~/components/Quiz/QuestionCard.vue';
import QuestionModal from '~/components/Quiz/QuestionModal.vue';
import { useQuestionModalStore } from '~/stores/Question/questionModal';
import useQuiz from '~/composables/Quiz/useQuiz';
import useQuestion from '~/composables/Question/useQuestion';
import type { Question, Quiz } from '~/types/Quiz/quiz.interface';
import helper from '~/utils/helper';

const route = useRoute();
const quizId = Number(route.params.id);
const quiz = useQuiz();
const questionComposable = useQuestion(); // Renamed to avoid confusion
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
    const quizResponse = await quiz.fetchQuizById(quizId);
    quizData.value = quizResponse;
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
    // Use the questionComposable with the correct method signature
    await questionComposable.deleteQuestion(quizId, question.ID);
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
        <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div class="w-full md:w-3/5">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{{ quizData.Title }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">{{ quizData.Description }}</p>
            <img :src="helper.getHttp(quizData.ImageURL)" alt="Quiz Image" class="mt-4 rounded-lg shadow-md w-full max-w-md">
          </div>

          <div class="w-full md:w-2/5 flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Quiz Information</h2>
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Time Limit:</span>
                <span class="font-medium">{{ quizData.TimeLimit }} secound</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Status:</span>
                <span class="font-medium">{{ quizData.IsPublished ? 'Published' : 'Draft' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Created:</span>
                <span class="font-medium">{{ new Date(quizData.CreatedAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex justify-between">
                <button>
                  <NuxtLink :to="`${route.path}/edit`" class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    Edit Quiz
                  </NuxtLink>
                </button>
                <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
                  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Delete Quiz
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Questions Section -->
        <div class="mt-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Questions</h2>

          <button 
          @click="openCreateQuestionModal" 
          type="button" 
          class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Add Question
          </button>

          <!-- Empty Questions State -->
          <div v-if="!questions.length" class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No Questions Added</h3>
            <p class="mt-1 text-gray-500 dark:text-gray-400">Add questions to start building your quiz.</p>
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