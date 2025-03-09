<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { Question, Choice } from "@/types/Quiz/quiz.interface";

const props = defineProps<{
  question: Question;
  questionNumber: number;
}>();

const emit = defineEmits<{
  (e: 'update:question', question: Question): void;
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
};

const removeChoice = (index: number) => {
  const isRemovingCorrect = questionData.choices[index].isCorrect;
  questionData.choices.splice(index, 1);
  
  // If we removed the correct answer and have other choices, make the first one correct
  if (isRemovingCorrect && questionData.choices.length > 0) {
    questionData.choices[0].isCorrect = true;
  }
};

const setCorrectChoice = (index: number) => {
  // Set all choices to not correct
  questionData.choices.forEach((choice, i) => {
    choice.isCorrect = i === index;
  });
};

const handleImageError = (event: Event) => {
  // Hide the image if it fails to load
  (event.target as HTMLImageElement).style.display = 'none';
};
</script>
<template>
    <div class="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-md font-medium">Question {{ questionNumber }}</h3>
        <button 
          type="button"
          @click="$emit('remove')"
          class="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
  
      <div class="mb-4">
        <label :for="`question-text-${questionNumber}`" class="block text-sm font-medium">
          Question Text
        </label>
        <textarea
          :id="`question-text-${questionNumber}`"
          v-model="questionData.text"
          rows="2"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        ></textarea>
      </div>
  
      <div class="mb-4">
        <label :for="`question-image-${questionNumber}`" class="block text-sm font-medium">
          Image URL (Optional)
        </label>
        <input
          type="text"
          :id="`question-image-${questionNumber}`"
          v-model="questionData.imageURL"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        <div v-if="questionData.imageURL" class="mt-2">
          <img 
            :src="questionData.imageURL" 
            alt="Question image" 
            class="h-40 w-auto object-cover rounded-md"
            @error="handleImageError"
          />
        </div>
      </div>
  
      <div class="mt-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-medium">Answer Choices</h4>
          <button
            type="button"
            @click="addChoice"
            class="text-xs inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-2 py-1 font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Add Choice
          </button>
        </div>
  
        <p v-if="questionData.choices.length === 0" class="text-gray-500 text-sm">
          No choices added yet. Add at least two choices.
        </p>
  
        <div 
          v-for="(choice, choiceIndex) in questionData.choices" 
          :key="choiceIndex"
          class="flex items-start space-x-3 mb-3 bg-white p-3 rounded-md border border-gray-100"
        >
          <div class="flex-shrink-0 pt-1">
            <input
              type="radio"
              :id="`choice-${questionNumber}-${choiceIndex}`"
              :name="`correct-choice-${questionNumber}`"
              :checked="choice.isCorrect"
              @change="setCorrectChoice(choiceIndex)"
              class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          
          <div class="flex-grow">
            <div class="mb-2">
              <label :for="`choice-text-${questionNumber}-${choiceIndex}`" class="sr-only">
                Choice Text
              </label>
              <input
                type="text"
                :id="`choice-text-${questionNumber}-${choiceIndex}`"
                v-model="choice.text"
                placeholder="Enter choice text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label :for="`choice-image-${questionNumber}-${choiceIndex}`" class="text-xs text-gray-500">
                Image URL (Optional)
              </label>
              <input
                type="text"
                :id="`choice-image-${questionNumber}-${choiceIndex}`"
                v-model="choice.imageURL"
                placeholder="https://example.com/image.jpg"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <div v-if="choice.imageURL" class="mt-1">
                <img 
                  :src="choice.imageURL" 
                  alt="Choice image" 
                  class="h-16 w-auto object-cover rounded-md"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
  
          <button
            type="button"
            @click="removeChoice(choiceIndex)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Remove choice"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
  
      <div v-if="hasValidationErrors" class="mt-4 text-sm text-red-600">
        <p v-if="!hasCorrectAnswer && questionData.choices.length > 0">
          Please mark at least one answer as correct.
        </p>
        <p v-if="questionData.choices.length < 2">
          Please add at least two choices.
        </p>
      </div>
    </div>
</template>
  
