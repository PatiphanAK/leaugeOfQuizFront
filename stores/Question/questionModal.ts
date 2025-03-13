import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Question } from '~/types/Quiz/quiz.interface'

export const useQuestionModalStore = defineStore('questionModal', () => {
    // State
    const isToggleQuestion = ref(false); // Renamed to match component usage
    const currentQuestion = ref<Question | null>(null); // Renamed to match component usage
    const quizId = ref<number | null>(null); // Added missing state

    // Methods
    const toggleQuestionModal = (state: boolean) => {
        isToggleQuestion.value = state;
    };

    const setCurrentQuestion = (question: Question | null) => {
        currentQuestion.value = question;
    };

    const setQuizId = (id: number) => {
        quizId.value = id;
    };

    // Keep the original methods for backward compatibility
    const openDialog = (id = null) => {
        currentQuestion.value = id;
        isToggleQuestion.value = true;
    };

    const closeDialog = () => {
        currentQuestion.value = null;
        isToggleQuestion.value = false;
    };

    return { 
        isToggleQuestion, 
        currentQuestion, 
        quizId,
        toggleQuestionModal,
        setCurrentQuestion,
        setQuizId,
        openDialog, 
        closeDialog
    };
});