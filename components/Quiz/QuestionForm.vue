<script setup lang="ts">
import { computed } from 'vue';
import type { Question, Choice } from "@/types/Quiz/quiz.interface";

// Define props with direct modelValue for v-model support
const props = defineProps<{
  modelValue: Question,
  questionNumber: number,
  questionImage: File | null,
  choiceImages: Array<File | null>
}>();

// Define emits with 'update:modelValue' for v-model
const emit = defineEmits([
  'update:modelValue', 
  'update:questionImage', 
  'update:choiceImage', 
  'remove'
]);

// Computed getter/setter for v-model support
const question = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Add a new choice
const addChoice = () => {
  const newChoice: Choice = {
    id: Math.floor(Math.random() * -1000), // Temporary negative ID for new choices
    questionID: question.value.id || 0,
    text: '',
    isCorrect: false,
    imageURL: '',
  };
  
  if (!question.value.choices) {
    question.value.choices = [];
  }
  
  // Create a new array to ensure reactivity
  const updatedChoices = [...question.value.choices, newChoice];
  
  emit('update:modelValue', {
    ...question.value,
    choices: updatedChoices
  });
};

// Remove a choice
const removeChoice = (index: number) => {
  if (!question.value.choices) return;
  
  const updatedChoices = [...question.value.choices];
  updatedChoices.splice(index, 1);
  
  emit('update:modelValue', {
    ...question.value,
    choices: updatedChoices
  });
};

// Set a choice as correct
const setCorrect = (index: number) => {
  if (!question.value.choices) return;
  
  const updatedChoices = question.value.choices.map((choice, i) => ({
    ...choice,
    isCorrect: i === index
  }));
  
  emit('update:modelValue', {
    ...question.value,
    choices: updatedChoices
  });
};

// Handle question text change
const updateQuestionText = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', {
    ...question.value,
    text: target.value
  });
};

// Handle question image change
const handleQuestionImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit('update:questionImage', target.files[0]);
  }
};

// Handle choice image change
const handleChoiceImageChange = (choiceIndex: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit('update:choiceImage', choiceIndex, target.files[0]);
  }
};

// Handle choice text change
const updateChoiceText = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!question.value.choices) return;
  
  const updatedChoices = [...question.value.choices];
  updatedChoices[index] = {
    ...updatedChoices[index],
    text: target.value
  };
  
  emit('update:modelValue', {
    ...question.value,
    choices: updatedChoices
  });
};

// Clear question image URL
const clearQuestionImage = () => {
  emit('update:modelValue', {
    ...question.value,
    imageURL: ''
  });
};

// Clear choice image URL
const clearChoiceImage = (choiceIndex: number) => {
  if (!question.value.choices) return;
  
  const updatedChoices = [...question.value.choices];
  updatedChoices[choiceIndex] = {
    ...updatedChoices[choiceIndex],
    imageURL: ''
  };
  
  emit('update:modelValue', {
    ...question.value,
    choices: updatedChoices
  });
};
</script>

<template>
  <div class="border border-gray-200 rounded-lg p-4 mb-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center">
        <div class="bg-indigo-100 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center mr-3">
          {{ questionNumber }}
        </div>
        <h3 class="text-lg font-medium">Question {{ questionNumber }}</h3>
      </div>
      
      <button 
        type="button" 
        @click="$emit('remove')"
        class="inline-flex items-center text-sm text-red-600 hover:text-red-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Remove
      </button>
    </div>
    
    <div class="space-y-4">
      <!-- Question Text -->
      <div>
        <label :for="`question-${questionNumber}`" class="block text-sm font-medium mb-1">
          Question Text
        </label>
        <input
          :id="`question-${questionNumber}`"
          type="text"
          :value="question.text"
          @input="updateQuestionText"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Enter your question here..."
        />
      </div>
      
      <!-- Question Image -->
      <div>
        <label :for="`question-image-${questionNumber}`" class="block text-sm font-medium mb-1">
          Question Image (optional)
        </label>
        
        <!-- Display existing image if available -->
        <div v-if="question.imageURL" class="mt-2 mb-4">
          <div class="relative w-56">
            <img 
              :src="question.imageURL" 
              alt="Question image" 
              class="h-40 w-56 object-cover rounded-md"
            />
            <button 
              type="button" 
              @click="clearQuestionImage"
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
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
      
      <!-- Choices -->
      <div>
        <label class="block text-sm font-medium mb-2">Answer Choices</label>
        
        <div v-if="!question.choices || question.choices.length === 0" class="text-gray-500 text-sm mb-2">
          No choices added yet.
        </div>
        
        <div 
          v-for="(choice, index) in question.choices" 
          :key="index"
          class="flex items-start border border-gray-200 rounded-md p-3 mb-3"
          :class="{ 'bg-green-50 border-green-200': choice.isCorrect }"
        >
          <!-- Correct choice indicator -->
          <div class="flex-shrink-0 mr-3 mt-1">
            <button 
              type="button"
              @click="setCorrect(index)"
              class="w-5 h-5 rounded-full border flex items-center justify-center"
              :class="choice.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'"
            >
              <svg v-if="choice.isCorrect" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
          
          <div class="flex-1 space-y-3">
            <!-- Choice Text -->
            <input
              type="text"
              :value="choice.text"
              @input="(e) => updateChoiceText(index, e)"
              required
              class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              :class="{ 'border-green-300': choice.isCorrect }"
              placeholder="Enter choice text..."
            />
            
            <!-- Choice Image -->
            <div>
              <!-- Display existing image if available -->
              <div v-if="choice.imageURL" class="mt-2 mb-2">
                <div class="relative w-40">
                  <img 
                    :src="choice.imageURL" 
                    alt="Choice image" 
                    class="h-28 w-40 object-cover rounded-md"
                  />
                  <button 
                    type="button" 
                    @click="clearChoiceImage(index)"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <input
                type="file"
                accept="image/*"
                @change="(e) => handleChoiceImageChange(index, e)"
                class="block w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
          
          <!-- Remove Choice -->
          <button 
            type="button" 
            @click="removeChoice(index)"
            class="flex-shrink-0 ml-2 mt-1 text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <button
          type="button"
          @click="addChoice"
          class="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Choice
        </button>
      </div>
    </div>
  </div>
</template>