<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { Question, Choice } from "@/types/Quiz/quiz.interface";

const props = defineProps<{
  question: Question;
  questionNumber: number;
  questionImage?: File | null;
  choiceImages?: (File | null)[];
}>();

const emit = defineEmits<{
  (e: 'update:question', question: Question): void;
  (e: 'update:questionImage', image: File | null): void;
  (e: 'update:choiceImage', index: number, image: File | null): void;
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

// Image previews
const questionImagePreview = ref<string | null>(props.question.imageURL || null);
const choiceImagePreviews = ref<(string | null)[]>(
  props.question.choices ? props.question.choices.map(c => c.imageURL || null) : []
);

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
  
  // Add a null placeholder for the choice image
  choiceImagePreviews.value.push(null);
};

const removeChoice = (index: number) => {
  const isRemovingCorrect = questionData.choices[index].isCorrect;
  questionData.choices.splice(index, 1);
  choiceImagePreviews.value.splice(index, 1);
  
  // If we removed the correct answer and have other choices, make the first one correct
  if (isRemovingCorrect && questionData.choices.length > 0) {
    questionData.choices[0].isCorrect = true;
  }
  
  // Emit event to remove the choice image in the parent
  emit('update:choiceImage', index, null);
};

const setCorrectChoice = (index: number) => {
  // Set all choices to not correct
  questionData.choices.forEach((choice, i) => {
    choice.isCorrect = i === index;
  });
};

// File handling
const handleQuestionImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // Clear the imageURL since we're now using a file
    questionData.imageURL = '';
    questionImagePreview.value = URL.createObjectURL(file);
    emit('update:questionImage', file);
  }
};

const handleChoiceImageChange = (choiceIndex: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // Clear the imageURL since we're now using a file
    questionData.choices[choiceIndex].imageURL = '';
    choiceImagePreviews.value[choiceIndex] = URL.createObjectURL(file);
    emit('update:choiceImage', choiceIndex, file);
  }
};

const removeQuestionImage = () => {
  questionImagePreview.value = null;
  questionData.imageURL = '';
  emit('update:questionImage', null);
};

const removeChoiceImage = (choiceIndex: number) => {
  choiceImagePreviews.value[choiceIndex] = null;
  questionData.choices[choiceIndex].imageURL = '';
  emit('update:choiceImage', choiceIndex, null);
};
</script>

<template>
<template></template>