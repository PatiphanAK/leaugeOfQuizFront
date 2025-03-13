import {defineStore} from 'pinia'
import { ref } from 'vue'

export const useQuestionModalStore = defineStore('questionModal', () => {
    const isToggleQuestionModal = ref(false);
    const selectedQuestion = ref(null);

    const openDialog = (id = null) => {
        selectedQuestion.value = id
        isToggleQuestionModal.value = true
    };

    const closeDialog = () => {
        selectedQuestion.value = null
        isToggleQuestionModal.value = false
    };

    return { isToggleQuestionModal, selectedQuestion, openDialog, closeDialog};
}
);
