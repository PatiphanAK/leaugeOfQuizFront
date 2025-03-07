import type { Quiz, Question } from "~/types/Quiz/quiz.interface";
import { defineStore } from "pinia";

export const useQuizStore = defineStore('quiz', () => {
    const quiz = ref<Quiz | null>(null);

    function addQuestion(question: Question) {
        if (quiz.value) {
            quiz.value.questions.push(question);
        }
    }
    function removeQuestion(questionId: number) {
        if (quiz.value) {
            quiz.value.questions = quiz.value.questions.filter(q => q.id !== questionId);
        }
    }
    function resetQuiz() {
        quiz.value = null;
    }
    return {
        quiz,
        resetQuiz
    };
});