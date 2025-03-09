<script setup lang="ts">
import QuizBaseForm from '~/components/Quiz/QuizBaseForm.vue';

// Set page metadata
useHead({
  title: 'Create New Quiz - League of Quiz',
  meta: [
    { name: 'description', content: 'Create a new quiz with questions and answers' }
  ]
});
</script>

<template>
  <div>
    <QuizBaseForm/>
  </div>
</template>