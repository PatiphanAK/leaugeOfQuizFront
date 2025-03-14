<script lang="ts" setup>
import type { Question } from '~/types/Quiz/quiz.interface';
import helper from '~/utils/helper';

const props = withDefaults(defineProps<{
    questions: Question[];
    showCorrectAnswers?: boolean;
}>(), {
    showCorrectAnswers: false
});


const emit = defineEmits(['edit', 'delete']);
const handleEdit = (question: Question) => {
    emit('edit', question);
};
const handleDelete = (question: Question) => {
    emit('delete', question);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="question in questions" :key="question.ID" class="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div v-if="question.ImageURL" class="h-48 overflow-hidden rounded-t-lg">
        <img class="w-full h-full object-cover" :src="helper.getHttp(question.ImageURL)" alt="Question Image" />
      </div>

      <div class="p-5">
        <div class="flex justify-between items-start mb-4">
          <h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{{ question.Text }}</h5>
          
          <!-- Edit and Delete buttons -->
          <div class="flex space-x-2">
            <button @click="handleEdit(question)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit Question">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="handleDelete(question)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Delete Question">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <ul class="space-y-2">
          <li v-for="choice in question.Choices" :key="choice.ID"
              class="p-3 rounded-md bg-gray-50 border border-gray-200">
            <div class="flex items-center">
              <img v-if="choice.ImageURL" :src="helper.getHttp(choice.ImageURL)" alt="Choice Image" class="h-6 w-6 mr-2 object-cover rounded" />
              <span class="font-medium">
                {{ choice.Text }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>