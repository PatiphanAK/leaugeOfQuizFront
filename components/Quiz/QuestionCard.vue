<script lang="ts" setup>
import type { Question } from '~/types/Quiz/quiz.interface';
const props = withDefaults(defineProps<{
    questions: Question[];
    showCorrectAnswers?: boolean;
}>(), {
    showCorrectAnswers: false
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="question in questions" :key="question.ID" class="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div v-if="question.ImageURL" class="h-48 overflow-hidden rounded-t-lg">
        <img class="w-full h-full object-cover" :src="question.ImageURL" alt="Question Image" />
      </div>

      <div class="p-5">
        <h5 class="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{{ question.Text }}</h5>

        <ul class="space-y-2">
          <li v-for="choice in question.Choices" :key="choice.ID"
              class="p-3 rounded-md bg-gray-50 border border-gray-200">
            <div class="flex items-center">
              <img v-if="choice.ImageURL" :src="choice.ImageURL" alt="Choice Image" class="h-6 w-6 mr-2 object-cover rounded" />
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