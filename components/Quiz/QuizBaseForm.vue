<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useQuiz from "~/composables/Quiz/useQuiz";
import type { CreateUpdateQuizData, Category } from "@/types/Quiz/quiz.interface";
import { Helper } from '@/utils/helper';

const quiz = useQuiz();
const router = useRouter();
const route = useRoute();
const helper = new Helper();

const isLoading = ref(false);
const error = ref('');
const isEditMode = computed(() => route.params.id !== undefined);
const categories = ref<Category[]>([]);

const quizData = ref<CreateUpdateQuizData>({
  Title: '',
  Description: '',
  TimeLimit: 0,
  Categories: [],
  IsPublished: false,
  ImageURL: ''
});

// Handle file upload for quiz image
const handleQuizImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    quizData.value.ImageURL = file; // Store the file object directly
  }
};

// Computed property for image preview
const imagePreview = computed(() => {
  if (!quizData.value.ImageURL) return "";
  if (typeof quizData.value.ImageURL === "string") {
    return quizData.value.ImageURL;
  }
  // Handle File object
  return URL.createObjectURL(quizData.value.ImageURL as File);
});

// Initialize quiz data by fetching categories and quiz details if in edit mode
async function initializeQuizData() {
  isLoading.value = true;
  error.value = '';
  
  try {
    // Fetch categories
    const categoriesResponse = await quiz.fetchCategories();
    if (categoriesResponse) {
      categories.value = categoriesResponse;
    }
    
    // If in edit mode, fetch the quiz data
    if (isEditMode.value && route.params.id) {
      const quizId = Number(route.params.id);
      if (!isNaN(quizId)) {
        const quizResponse = await quiz.fetchQuizById(quizId);
        console.log("Quiz Response:", quizResponse); // Debug log
        // Check if response exists and has the expected structure
        if (quizResponse && quizResponse.data) {
            quizData.value = {
              Title: quizResponse.data.Title || '',
              Description: quizResponse.data.Description || '',
              TimeLimit: quizResponse.data.TimeLimit || 0,
              Categories: quizResponse.data.Categories.map((category: any) => typeof category === 'number' ? { ID: category, Name: '', description: '' } : category) || [],
              IsPublished: quizResponse.data.IsPublished || false,
              ImageURL: quizResponse.data.ImageURL || ''
            };
        } else {
          console.error("Error is ",error);
        }
      } else {
        console.error("Quiz response is empty or undefined");
        error.value = "Could not find quiz data";
      }
    } else {
      error.value = 'Invalid quiz ID';
    }
  } catch (err) {
    console.error('Error fetching quiz data:', err);
    error.value = 'Failed to fetch quiz data. Please try again.';
  } finally {
    isLoading.value = false;
  }
} 


// Validate form before submission
const validateForm = () => {
  let isValid = true;
  error.value = '';
  
  if (!quizData.value.Title.trim()) {
    error.value = 'Quiz title is required';
    isValid = false;
  } else if (quizData.value.TimeLimit <= 0) {
    error.value = 'Time limit must be greater than 0';
    isValid = false;
  }
  
  return isValid;
};

// Submit form handler
const submitForm = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  error.value = '';
  
  try {
    const formData = helper.createFormDataFromObject(quizData.value);
    
    if (isEditMode.value && route.params.id) {
      // Update existing quiz
      const quizId = Number(route.params.id);
      if (!isNaN(quizId)) {
        await quiz.updateQuiz(quizId, formData);
      } else {
        throw new Error('Invalid quiz ID');
      }
    } else {
      // Create new quiz
      await quiz.createQuiz(formData);
    }
    cancel();
  } catch (err) {
    console.error('Error saving quiz:', err);
    error.value = 'Failed to save quiz. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Cancel form and go back
const cancel = () => {
  router.back();
};

// Call initializeQuizData during setup
onMounted(() => {
  initializeQuizData();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow rounded-lg p-6">
      <!-- Header -->
      <div class="border-b pb-4 mb-6">
        <h1 class="text-2xl font-bold">{{ isEditMode ? 'Edit Quiz' : 'Create New Quiz' }}</h1>
        <p class="text-gray-600">Fill in the details below to {{ isEditMode ? 'update your' : 'create a new' }} quiz</p>
      </div>
      
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
      
      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md my-4">
        <p>{{ error }}</p>
        <button 
          @click="router.push('/dashboard/quizzes')" 
          class="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
        >
          Return to Quizzes
        </button>
      </div>
      
      <!-- Form -->
      <form v-if="!isLoading" @submit.prevent="submitForm" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label for="title" class="block text-sm font-medium">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              v-model="quizData.Title"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label for="timeLimit" class="block text-sm font-medium">
              Time Limit (seconds)
            </label>
            <input
              type="number"
              id="timeLimit"
              v-model="quizData.TimeLimit"
              min="1"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            v-model="quizData.Description"
            rows="3"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          ></textarea>
        </div>
        
        <!-- Quiz Image -->
        <div>
          <label for="quizImage" class="block text-sm font-medium">
            Quiz Image
          </label>
          
          <div v-if="imagePreview" class="mt-2 mb-4">
            <div class="relative w-56">
              <img 
                :src="helper.getHttp(imagePreview)" 
                alt="Quiz image"
                class="h-40 w-56 object-cover rounded-md"
              />
              <button 
                type="button" 
                @click="quizData.ImageURL = ''" 
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <input
            type="file"
            id="quizImage"
            accept="image/*"
            @change="handleQuizImageChange"
            class="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        
        <!-- Categories -->
        <div>
          <label for="categories" class="block text-sm font-medium">
            Categories
          </label>
          <select
            id="categories"
            v-model="quizData.Categories"
            multiple
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option 
              v-for="category in categories" 
              :key="category.ID" 
              :value="category"
            >
              {{ category.Name }}
            </option>
          </select>
        </div>
        
        <!-- Published Status -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            v-model="quizData.IsPublished"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="isPublished" class="ml-2 block text-sm text-gray-900">
            Publish Quiz
          </label>
        </div>
        
        <!-- Form Actions -->
        <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="cancel"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {{ isEditMode ? 'Update Quiz' : 'Create Quiz' }}
            <span v-if="isLoading" class="ml-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>