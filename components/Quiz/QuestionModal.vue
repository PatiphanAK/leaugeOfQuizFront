<script lang="ts" setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useQuestionModalStore } from '~/stores/Question/questionModal';
import type { CreateUpdateQuestionData, CreateUpdateChoiceData } from '~/types/Quiz/quiz.interface';
import useQuestion from '~/composables/Question/useQuestion';
import { useRoute } from 'vue-router';

const questionAPI = useQuestion();
const modalStore = useQuestionModalStore();
const isToggle = computed(() => modalStore.isToggleQuestion);
const editingQuestion = computed(() => modalStore.currentQuestion);
const route = useRoute();

const quizId = route.params.id;
const loading = ref(false);
const error = ref('');
const questionText = ref('');
const questionImage = ref<File | string | null>(null);
const previewQuestionImage = ref('');
const previewQuestionImageUrl = computed(() =>
  helper.getHttp(previewQuestionImage.value)
);
const choices = ref<CreateUpdateChoiceData[]>([
  { Text: '', ImageURL: undefined, IsCorrect: false },
  { Text: '', ImageURL: undefined, IsCorrect: false }
]);

// For showing image previews
const choiceImagePreviews = ref<(string | null)[]>([null, null]);

// Validation states
const isSubmitted = ref(false);
const isValid = computed(() => {
  if (!questionText.value.trim()) return false;
  if (choices.value.length < 2) return false;
  
  // Check if at least one choice is marked as correct
  const hasCorrectAnswer = choices.value.some(choice => choice.IsCorrect);
  
  // Check if all choices have text
  const allChoicesHaveText = choices.value.every(choice => choice.Text.trim() !== '');
  
  return hasCorrectAnswer && allChoicesHaveText;
});
// Watch for changes in the modal visibility
watch(isToggle, (newValue) => {
  if (newValue) {
    // If editing existing question, populate the form
    if (editingQuestion.value) {
      populateForm(editingQuestion.value);
    } else {
      // Reset form for new question
      resetForm();
    }
  }
});

// Populate form with existing question data
function populateForm(question: CreateUpdateQuestionData) {
  questionText.value = question.Text;
  
  if (typeof question.ImageURL === 'string' && question.ImageURL) {
    questionImage.value = question.ImageURL;
    previewQuestionImage.value = question.ImageURL;
  } else {
    questionImage.value = null;
    previewQuestionImage.value = '';
  }
  
  // Initialize choices
  choices.value = question.Choices.map(choice => ({
    Text: choice.Text,
    ImageURL: choice.ImageURL,
    IsCorrect: choice.IsCorrect
  }));
  
  // Initialize image previews for choices
  choiceImagePreviews.value = question.Choices.map(choice => 
    typeof choice.ImageURL === 'string' && choice.ImageURL ? choice.ImageURL : null
  );
}

// Reset form to default values
function resetForm() {
  questionText.value = '';
  questionImage.value = null;
  previewQuestionImage.value = '';
  choices.value = [
    { Text: '', ImageURL: undefined, IsCorrect: false },
    { Text: '', ImageURL: undefined, IsCorrect: false }
  ];
  choiceImagePreviews.value = [null, null];
  isSubmitted.value = false;
  error.value = '';
}

// Add a new choice
function addChoice() {
  choices.value.push({ Text: '', ImageURL: undefined, IsCorrect: false });
  choiceImagePreviews.value.push(null);
}

// Remove a choice
function removeChoice(index: number) {
  if (choices.value.length > 2) {
    choices.value.splice(index, 1);
    choiceImagePreviews.value.splice(index, 1);
  }
}

// Set a choice as correct and ensure only one is selected
function setCorrectChoice(index: number) {
  choices.value.forEach((choice, i) => {
    choice.IsCorrect = i === index;
  });
}

// Handle question image upload
function handleQuestionImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    questionImage.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewQuestionImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Handle choice image upload
function handleChoiceImageUpload(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    choices.value[index].ImageURL = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      choiceImagePreviews.value[index] = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Submit the form
async function submitForm() {
  isSubmitted.value = true;
  
  if (!isValid.value) {
    error.value = 'Please fill all required fields and select at least one correct answer.';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const questionData = new FormData();
    const jsonData: {
      quizId: number;
      text: string;
      choices: { id: string | undefined; text: string; isCorrect: boolean }[];
      questionId?: number;
    } = {
      quizId: parseInt(quizId.toString()),
      text: questionText.value,
      choices: choices.value.map(choice => ({
        id: choice.ID ? choice.ID.toString() : undefined,
        text: choice.Text,
        isCorrect: choice.IsCorrect,
      }))
    };
    
    if (editingQuestion.value && editingQuestion.value.ID) {
      jsonData.questionId = editingQuestion.value.ID;
    }
    questionData.append('questionData', JSON.stringify(jsonData));
    if (questionImage.value instanceof File) {
      questionData.append('image', questionImage.value);
    }
    choices.value.forEach((choice, index) => {
      if (choice.ImageURL instanceof File) {
        questionData.append(`choices[${index}][image]`, choice.ImageURL);
      }
    });
    
    if (editingQuestion.value && editingQuestion.value.ID) {
      await questionAPI.updateQuestion(editingQuestion.value.ID, questionData);
    } else {
      // Just pass the FormData - quizId is already inside it
      await questionAPI.createQuestion(questionData);
    }
    
    // Close modal and refresh questions
    modalStore.toggleQuestionModal(false);
  } catch (err: any) {
    error.value = err.message || 'Failed to save question';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Cancel and close modal
function cancelForm() {
  modalStore.toggleQuestionModal(false);
}
</script>

<template>
  <div v-if="isToggle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4">
        {{ editingQuestion ? 'Edit Question' : 'Add New Question' }}
      </h2>
      
      <form @submit.prevent="submitForm()" class="space-y-6">
        <!-- Question Text -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Question Text *</label>
          <textarea 
            v-model="questionText"
            rows="3"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{'border-red-500': isSubmitted && !questionText.trim()}"
            placeholder="Enter your question here"
          ></textarea>
          <p v-if="isSubmitted && !questionText.trim()" class="text-red-500 text-sm mt-1">
            Question text is required
          </p>
        </div>
        
        <!-- Question Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Question Image (Optional)</label>
          <input 
            type="file" 
            @change="handleQuestionImageUpload" 
            accept="image/*"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div v-if="previewQuestionImage" class="mt-2">
            <img :src="previewQuestionImageUrl" alt="Question image preview" class="max-h-40 rounded-md" />
          </div>
        </div>
        
        <!-- Choices Section -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Choices</h3>
            <button 
              type="button"
              @click="addChoice"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Choice
            </button>
          </div>
          
          <!-- Error message for choices -->
          <p v-if="isSubmitted && !choices.some(choice => choice.IsCorrect)" class="text-red-500 text-sm">
            Please select at least one correct answer
          </p>
          <p v-if="isSubmitted && !choices.every(choice => choice.Text.trim() !== '')" class="text-red-500 text-sm">
            All choices must have text
          </p>
          
          <!-- Choice Items -->
          <div v-for="(choice, index) in choices" :key="index" class="p-4 border rounded-md">
            <div class="flex items-start space-x-4">
              <!-- Correct answer radio -->
              <div class="pt-2">
                <input 
                  type="radio" 
                  :id="`choice-${index}`" 
                  name="correctChoice" 
                  :checked="choice.IsCorrect"
                  @change="setCorrectChoice(index)"
                  class="h-4 w-4 text-blue-600"
                />
              </div>
              
              <div class="flex-grow space-y-4">
                <!-- Choice text input -->
                <div>
                  <label :for="`choice-text-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                    Choice Text *
                  </label>
                  <input 
                    :id="`choice-text-${index}`"
                    v-model="choice.Text"
                    type="text"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{'border-red-500': isSubmitted && !choice.Text.trim()}"
                    placeholder="Enter choice text"
                  />
                </div>
                
                <!-- Choice image upload -->
                <div>
                  <label :for="`choice-image-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                    Choice Image (Optional)
                  </label>
                  <input 
                    :id="`choice-image-${index}`"
                    type="file" 
                    @change="(e) => handleChoiceImageUpload(e, index)" 
                    accept="image/*"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div v-if="choiceImagePreviews[index]" class="mt-2">
                    <img :src="choiceImagePreviews[index]" alt="Choice image preview" class="max-h-20 rounded-md" />
                  </div>
                </div>
              </div>
              
              <!-- Remove choice button -->
              <button 
                type="button"
                @click="removeChoice(index)"
                class="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                :disabled="choices.length <= 2"
                :class="{'opacity-50 cursor-not-allowed': choices.length <= 2}"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
        
        <!-- Error message -->
        <div v-if="error" class="p-3 bg-red-100 text-red-800 rounded-md">
          {{ error }}
        </div>
        
        <!-- Form buttons -->
        <div class="flex justify-end space-x-3">
          <button 
            type="button"
            @click="cancelForm"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Create Question') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>