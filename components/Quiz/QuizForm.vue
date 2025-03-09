<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import type { Quiz, Question, Choice, Category } from '@/types/Quiz/quiz.interface';

const props = defineProps<{
  quiz?: Quiz;
  categories: Category[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', quiz: Quiz): void;
  (e: 'cancel'): void;
}>();

// Initialize form data with default values
const formData = reactive<Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'creatorID'>>({
  title: '',
  description: '',
  timeLimit: 30,
  isPublished: false,
  imageURL: '',
  questions: [],
  categories: [],
});

// If quiz is provided, populate form with its data
watch(() => props.quiz, (newQuiz) => {
  if (newQuiz) {
    formData.title = newQuiz.title;
    formData.description = newQuiz.description;
    formData.timeLimit = newQuiz.timeLimit;
    formData.isPublished = newQuiz.isPublished;
    formData.imageURL = newQuiz.imageURL;
    formData.questions = [...newQuiz.questions]; // Create a copy to avoid modifying props directly
    formData.categories = [...newQuiz.categories];
  }
}, { immediate: true });

// Methods for handling form actions
const addQuestion = () => {
  const newQuestion: Omit<Question, 'id'> & { id?: number } = {
    quizID: props.quiz?.id || 0,
    text: '',
    imageURL: '',
    choices: [],
  };
  
  // If in edit mode and we have a quiz ID, assign a temporary ID
  if (props.quiz?.id) {
    newQuestion.id = Math.floor(Math.random() * -1000); // Temporary negative ID
  }
  
  formData.questions.push(newQuestion as Question);
};

const updateQuestion = (index: number, updatedQuestion: Question) => {
  formData.questions[index] = updatedQuestion;
};

const removeQuestion = (index: number) => {
  formData.questions.splice(index, 1);
};

const handleImageError = (event: Event) => {
  // Hide the image if it fails to load
  (event.target as HTMLImageElement).style.display = 'none';
};

const submitForm = () => {
  emit('submit', {
    ...formData,
    id: props.quiz?.id || 0,
    creatorID: props.quiz?.creatorID || 0,
    createdAt: props.quiz?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Quiz);
};
</script>
<template>
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label for="title" class="block text-sm font-medium">
            Quiz Title
          </label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label for="timeLimit" class="block text-sm font-medium">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            id="timeLimit"
            v-model="formData.timeLimit"
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
          v-model="formData.description"
          rows="3"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        ></textarea>
      </div>
  
      <div>
        <label for="imageURL" class="block text-sm font-medium">
          Image URL
        </label>
        <input
          type="text"
          id="imageURL"
          v-model="formData.imageURL"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        <div v-if="formData.imageURL" class="mt-2">
          <img 
            :src="formData.imageURL" 
            alt="Quiz preview" 
            class="h-40 w-auto object-cover rounded-md"
            @error="handleImageError"
          />
        </div>
      </div>
  
      <div>
        <label for="categories" class="block text-sm font-medium">
          Categories
        </label>
        <select
          id="categories"
          v-model="formData.categories"
          multiple
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option 
            v-for="category in categories" 
            :key="category.id" 
            :value="category"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
  
      <div class="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          v-model="formData.isPublished"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label for="isPublished" class="ml-2 block text-sm text-gray-900">
          Publish Quiz
        </label>
      </div>
  
      <div class="border-t border-gray-200 pt-6">
        <h2 class="text-lg font-medium">Questions</h2>
        
        <p v-if="formData.questions.length === 0" class="text-gray-500 mt-2">
          No questions added yet.
        </p>
        
        <QuestionForm
          v-for="(question, index) in formData.questions"
          :key="index"
          :question="question"
          :question-number="index + 1"
          @update:question="updateQuestion(index, $event)"
          @remove="removeQuestion(index)"
        />
        
        <button
          type="button"
          @click="addQuestion"
          class="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Question
        </button>
      </div>
  
      <div class="flex justify-end gap-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {{ quiz ? 'Update Quiz' : 'Create Quiz' }}
          <span v-if="isLoading" class="ml-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </button>
      </div>
    </form>
</template>
  
