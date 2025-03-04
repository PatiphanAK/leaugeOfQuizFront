<script lang="ts" setup>
import type { Quiz } from '~/types/Quiz/quiz.interface';
import { NuxtLink } from '#components';

interface OptionalQuiz extends Partial<Quiz> {
    id: number; // บังคับต้องส่งค่า
    title: string; // บังคับต้องส่งค่า
    description: string; // บังคับต้องส่งค่า
    image: string; // ไม่บังคับต้องส่งค่า
}

const quiz = defineProps<OptionalQuiz>();
</script>
<template>
<div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <a href="#">
        <img class="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
    </a>
    <div class="p-5">
        <NuxtLink :to="`/quiz/${quiz.id}`">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ quiz.title }}</h5>
        </NuxtLink>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ quiz.description }}</p>
        <NuxtLink :to="`/quiz/${quiz.id}`" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            อ่านเพิ่มเติม
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </NuxtLink>
    </div>
</div>
</template>