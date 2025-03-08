import type { Question } from "~/types/Quiz/quiz.interface";
import { defineStore } from "pinia";
import type { Answer } from "~/types/Quiz/quiz.interface";

const useQuestionStore = defineStore('question', () => {
    const question = ref<Question | null>(null);
    function resetQuestion() {
        question.value = null;
    }
    function addChoice(answer: Answer) {
        if (question.value) {
            question.value.answers.push(answer);
        }
    }
    function removeChoice(answerId: number) {
        if (question.value) {
            question.value.answers = question.value.answers.filter(a => a.id !== answerId);
        }
    }
    return {
        question,
        resetQuestion
    };
});