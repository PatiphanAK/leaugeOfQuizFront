<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { Question, Choice } from "@/types/Quiz/quiz.interface";

const props = defineProps<{
  question: Question;
  questionNumber: number;
  questionImage?: File | null;
  choiceImages?: (File | null)[];
}>();

const emit = defineEmits<{
  (e: 'update:question', question: Question): void;
  (e: 'update:questionImage', image: File | null): void;
  (e: 'update:choiceImage', index: number, image: File | null): void;
  (e: 'remove'): void;
}>();

// Create a reactive copy of the question to work with
const questionData = reactive<Question>({
  id: props.question.id || 0,
  quizID: props.question.quizID,
  text: props.question.text || '',
  imageURL: props.question.imageURL || '',
  choices: [...(props.question.choices || [])],
});

// Image previews
const questionImagePreview = ref<string | null>(props.question.imageURL || null);
const choiceImagePreviews = ref<(string | null)[]>(
  props.question.choices ? props.question.choices.map(c => c.imageURL || null) : []
);

// Watch for changes in the local copy and emit them to parent
watch(questionData, () => {
  emit('update:question', { ...questionData });
}, { deep: true });

// Validation
const hasCorrectAnswer = computed(() => {
  return questionData.choices.some(choice => choice.isCorrect);
});

const hasValidationErrors = computed(() => {
  return (questionData.choices.length > 0 && !hasCorrectAnswer.value) || 
         (questionData.choices.length < 2);
});

// Methods
const addChoice = () => {
  const newChoice: Omit<Choice, 'id'> & { id?: number } = {
    questionID: questionData.id,
    text: '',
    imageURL: '',
    isCorrect: questionData.choices.length === 0, // First choice is correct by default
  };
  
  // If in edit mode, assign a temporary ID
  if (questionData.id > 0) {
    newChoice.id = Math.floor(Math.random() * -1000); // Temporary negative ID
  }
  
  questionData.choices.push(newChoice as Choice);
  
  // Add a null placeholder for the choice image
  choiceImagePreviews.value.push(null);
};

const removeChoice = (index: number) => {
  const isRemovingCorrect = questionData.choices[index].isCorrect;
  questionData.choices.splice(index, 1);
  choiceImagePreviews.value.splice(index, 1);
  
  // If we removed the correct answer and have other choices, make the first one correct
  if (isRemovingCorrect && questionData.choices.length > 0) {
    questionData.choices[0].isCorrect = true;
  }
  
  // Emit event to remove the choice image in the parent
  emit('update:choiceImage', index, null);
};

const setCorrectChoice = (index: number) => {
  // Set all choices to not correct
  questionData.choices.forEach((choice, i) => {
    choice.isCorrect = i === index;
  });
};

// File handling
const handleQuestionImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // Clear the imageURL since we're now using a file
    questionData.imageURL = '';
    questionImagePreview.value = URL.createObjectURL(file);
    emit('update:questionImage', file);
  }
};

const handleChoiceImageChange = (choiceIndex: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // Clear the imageURL since we're now using a file
    questionData.choices[choiceIndex].imageURL = '';
    choiceImagePreviews.value[choiceIndex] = URL.createObjectURL(file);
    emit('update:choiceImage', choiceIndex, file);
  }
};

const removeQuestionImage = () => {
  questionImagePreview.value = null;
  questionData.imageURL = '';
  emit('update:questionImage', null);
};

const removeChoiceImage = (choiceIndex: number) => {
  choiceImagePreviews.value[choiceIndex] = null;
  questionData.choices[choiceIndex].imageURL = '';
  emit('update:choiceImage', choiceIndex, null);
};
</script>

<template>
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <!-- Question Header -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Question {{ questionNumber }}</h3>
        <button 
          type="button" 
          @click="$emit('remove')" 
          class="text-red-600 hover:text-red-800 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
  
      <!-- Question Text -->
      <div class="mb-4">
        <label for="question-text" class="block text-sm font-medium mb-1">
          Question Text
        </label>
        <textarea
          :id="`question-text-${questionNumber}`"
          v-model="questionData.text"
          required
          rows="2"
          class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Enter your question here"
        ></textarea>
      </div>
  
      <!-- Question Image -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">
          Question Image (Optional)
        </label>
        
        <div v-if="questionImagePreview" class="mb-2">
          <div class="relative w-40">
            <img 
              :src="questionImagePreview" 
              alt="Question image preview" 
              class="h-32 w-40 object-cover rounded-md"
            />
            <button 
              type="button" 
              @click="removeQuestionImage" 
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <input
          :id="`question-image-${questionNumber}`"
          type="file"
          accept="image/*"
          @change="handleQuestionImageChange"
          class="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
  
      <!-- Choices Section -->
      <div class="mt-6">
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-md font-medium">Answer Choices</h4>
        </div>
        
        <!-- Validation Errors -->
        <div v-if="hasValidationErrors" class="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p v-if="questionData.choices.length < 2">Please add at least 2 choices.</p>
          <p v-if="questionData.choices.length > 0 && !hasCorrectAnswer">Please mark at least one choice as correct.</p>
        </div>
  
        <!-- List of Choices -->
        <div v-for="(choice, index) in questionData.choices" :key="index" class="mb-4 p-4 border border-gray-200 rounded-md">
          <div class="flex items-start gap-4">
            <!-- Correct Choice Radio Button -->
            <div class="mt-2">
              <input 
                :id="`choice-correct-${questionNumber}-${index}`" 
                type="radio" 
                :name="`question-${questionNumber}-correct`"
                :checked="choice.isCorrect"
                @change="setCorrectChoice(index)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
            </div>
            
            <div class="flex-1">
              <!-- Choice Text -->
              <div class="mb-3">
                <label :for="`choice-text-${questionNumber}-${index}`" class="block text-sm font-medium mb-1">
                  Choice {{ index + 1 }} {{ choice.isCorrect ? '(Correct)' : '' }}
                </label>
                <input 
                  :id="`choice-text-${questionNumber}-${index}`" 
                  v-model="choice.text" 
                  type="text" 
                  required
                  class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter choice text"
                />
              </div>
              
              <!-- Choice Image -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Choice Image (Optional)
                </label>
                
                <div v-if="choiceImagePreviews[index]" class="mb-2">
                  <div class="relative w-32">
                    <img 
                      :src="choiceImagePreviews[index]" 
                      alt="Choice image preview" 
                      class="h-24 w-32 object-cover rounded-md"
                    />
                    <button 
                      type="button" 
                      @click="removeChoiceImage(index)" 
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <input
                  :id="`choice-image-${questionNumber}-${index}`"
                  type="file"
                  accept="image/*"
                  @change="(e) => handleChoiceImageChange(index, e)"
                  class="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
            
            <!-- Remove Choice Button -->
            <button 
              type="button" 
              @click="removeChoice(index)" 
              class="text-red-600 hover:text-red-800 focus:outline-none mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Add Choice Button -->
        <button
          type="button"
          @click="addChoice"
          class="mt-2 inline-flex items-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Choice
        </button>
      </div>
    </div>
  </template>