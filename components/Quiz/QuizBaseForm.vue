<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useQuiz from "~/composables/Quiz/useQuiz";
import type { Quiz, Question, Choice, Category } from "@/types/Quiz/quiz.interface";
import QuestionForm from '@/components/Quiz/QuestionForm.vue';

const router = useRouter();
const route = useRoute();
const quizAPI = useQuiz();

// State management
const isLoading = ref(false);
const isEditMode = computed(() => route.params.id !== undefined);
const categories = ref<Category[]>([]);
const quizData = ref<Quiz>({
  id: 0,
  title: '',
  description: '',
  timeLimit: 30,
  isPublished: false,
  imageURL: '',
  creatorID: 0,
  createdAt: '',
  updatedAt: '',
  questions: [],
  categories: []
});

// File uploads
const quizImage = ref<File | null>(null);
const questionImages = ref<(File | null)[]>([]);
const choiceImages = ref<Array<Array<File | null>>>([]);

// Initialize the form
onMounted(async () => {
  isLoading.value = true;
  
  try {
    // Load categories
    await fetchCategories();
    
    // If in edit mode, load the quiz
    if (isEditMode.value) {
      await fetchQuiz();
    }
  } catch (error) {
    console.error('Error initializing form:', error);
  } finally {
    isLoading.value = false;
  }
});

// Fetch categories
const fetchCategories = async () => {
  categories.value = await quizAPI.fetchCategories();
};


// Fetch quiz details in edit mode
const fetchQuiz = async () => {
  if (!route.params.id) return;
  
  const quizId = Number(route.params.id);
  const fetchedQuiz = await quizAPI.fetchQuizById(quizId);
  
  if (fetchedQuiz) {
    quizData.value = fetchedQuiz;
    
    // Initialize arrays for question and choice images
    initializeImageArrays();
  } else {
    // Handle quiz not found
    router.push('/dashboard/quizzes');
  }
};

// Initialize arrays for question and choice images
const initializeImageArrays = () => {
  // Reset arrays
  questionImages.value = [];
  choiceImages.value = [];
  
  // Create placeholder arrays based on quiz questions
  quizData.value.questions.forEach((question) => {
    questionImages.value.push(null);
    
    const choiceImageArray: (File | null)[] = [];
    question.choices.forEach(() => {
      choiceImageArray.push(null);
    });
    
    choiceImages.value.push(choiceImageArray);
  });
};

// Question management
const addQuestion = () => {
  const newQuestion: Question = {
    id: Math.floor(Math.random() * -1000), // Temporary negative ID for new questions
    quizID: quizData.value.id || 0,
    text: '',
    imageURL: '',
    choices: []
  };
  
  quizData.value.questions.push(newQuestion);
  questionImages.value.push(null);
  choiceImages.value.push([]);
};

const updateQuestion = (index: number, updatedQuestion: Question) => {
  quizData.value.questions[index] = updatedQuestion;
};

const removeQuestion = (index: number) => {
  quizData.value.questions.splice(index, 1);
  questionImages.value.splice(index, 1);
  choiceImages.value.splice(index, 1);
};

// Image handling
const handleQuizImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    quizImage.value = target.files[0];
  }
};

const updateQuestionImage = (questionIndex: number, image: File | null) => {
  questionImages.value[questionIndex] = image;
};

const updateChoiceImage = (questionIndex: number, choiceIndex: number, image: File | null) => {
  // Ensure the array for this question exists
  if (!choiceImages.value[questionIndex]) {
    choiceImages.value[questionIndex] = [];
  }
  
  // Update the image
  choiceImages.value[questionIndex][choiceIndex] = image;
};

// Form submission
const submitForm = async () => {
  isLoading.value = true;
  
  try {
    // Prepare quiz data
    const formattedQuizData = {
      title: quizData.value.title,
      description: quizData.value.description,
      timeLimit: quizData.value.timeLimit,
      isPublished: quizData.value.isPublished,
      categories: quizData.value.categories.map(cat => typeof cat === 'object' ? cat.ID : cat),
      questions: quizData.value.questions.map(question => ({
        text: question.text,
        choices: question.choices.map(choice => ({
          text: choice.text,
          isCorrect: choice.isCorrect
        }))
      }))
    };
    
    // Correctly structure file data to match expected types
    const files: {
      quizImage?: File; 
      questionImages?: File[];
      choiceImages?: Array<Array<File | null>>;
    } = {};
    
    // Add quiz image if exists
    if (quizImage.value) {
      files.quizImage = quizImage.value;
    }
    
    // Add question images if any exist
    const validQuestionImages = questionImages.value.filter(img => img !== null) as File[];
    if (validQuestionImages.length > 0) {
      files.questionImages = validQuestionImages;
    }
    
    // Add choice images - maintaining the nested structure
    if (choiceImages.value.length > 0) {
      files.choiceImages = choiceImages.value;
    }
    console.log("Formatted Quiz Data:", formattedQuizData);
    let result;
    
    if (isEditMode.value) {
      // Update existing quiz
      result = await quizAPI.updateQuiz(Number(route.params.id), quizData.value);
    } else {
    //   // Create new quiz
      result = await quizAPI.createQuiz(formattedQuizData, files);
    }
    
    if (result) {
      // Navigate to quiz list on success
      router.push('/dashboard/quizzes');
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
  } finally {
    isLoading.value = false;
  }
};

const cancel = () => {
  router.push('/dashboard/quizzes');
};
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
      
      <!-- Form -->
      <form v-else @submit.prevent="submitForm" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label for="title" class="block text-sm font-medium">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              v-model="quizData.title"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label for="timeLimit" class="block text-sm font-medium">
              Time Limit (secounds)
            </label>
            <input
              type="number"
              id="timeLimit"
              v-model="quizData.timeLimit"
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
            v-model="quizData.description"
            rows="3"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          ></textarea>
        </div>
        
        <!-- Quiz Image -->
        <div>
          <label for="quizImage" class="block text-sm font-medium">
            Quiz Image
          </label>
          
          <div v-if="quizData.imageURL" class="mt-2 mb-4">
            <div class="relative w-56">
              <img 
                :src="quizData.imageURL" 
                alt="Quiz image" 
                class="h-40 w-56 object-cover rounded-md"
              />
              <button 
                type="button" 
                @click="quizData.imageURL = ''" 
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
            v-model="quizData.categories"
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
            v-model="quizData.isPublished"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="isPublished" class="ml-2 block text-sm text-gray-900">
            Publish Quiz
          </label>
        </div>
        
        <!-- Questions Section -->
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium">Questions</h2>
          
          <p v-if="quizData.questions.length === 0" class="text-gray-500 mt-2">
            No questions added yet.
          </p>
          
          <QuestionForm
            v-for="(question, index) in quizData.questions"
            :key="index"
            :question="question"
            :question-number="index + 1"
            :question-image="questionImages[index]"
            :choice-images="choiceImages[index]"
            @update:question="updateQuestion(index, $event)"
            @update:questionImage="updateQuestionImage(index, $event)"
            @update:choiceImage="(choiceIndex, image) => updateChoiceImage(index, choiceIndex, image)"
            @remove="removeQuestion(index)"
          />
          
          <button
            type="button"
            @click="addQuestion"
            class="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Question
          </button>
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