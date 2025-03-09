<script setup lang="ts">
import type { Quiz,Question, Choice, Category } from "@/types/Quiz/quiz.interface";
import useQuiz from "~/composables/Quiz/useQuiz";

const quizAPI = useQuiz();
const currentCategory = ref<Category | null>(null);

async function loadCategories() {
    const categories = await quizAPI.fetchCategories();
    currentCategory.value = categories.length > 0 ? categories[0] : null;
}

const submitQuiz = async (quiz: Quiz) => {
}

loadCategories();
</script>
<template>
</template>