import { ref } from 'vue';
import type { CreateUpdateQuestionData } from "~/types/Quiz/quiz.interface";
import QuestionAPI from "@/api/Quiz/question.api";

export default function useQuestion() {
  const questionApi = QuestionAPI();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const question = ref<any>(null);
  const questions = ref<any[]>([]);
  
  const clearError = () => {
    error.value = null;
  };
  
  const createQuestion = async (data: CreateUpdateQuestionData | FormData) => {
    loading.value = true;
    error.value = null;
    
    try {
      let quizId: number;
      
      if (data instanceof FormData) {
        const quizIdValue = data.get('quizId');
        quizId = quizIdValue ? parseInt(quizIdValue.toString()) : 0;
      } else {
        quizId = data.QuizID;
      }
      
      const result = await questionApi.CreateQuestion(quizId, data);
      question.value = result;
      return result;
    } catch (err) {
      throw (err);
    } finally {
      loading.value = false;
    }
  };
  
  const updateQuestion = async (id: number, data: CreateUpdateQuestionData | FormData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await questionApi.UpdateQuestion(id, data);
      question.value = result;
      return result;
    } catch (err) {
      throw (err);
    } finally {
      loading.value = false;
    }
  };
  
  const deleteQuestion = async (quizId: number, id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await questionApi.DeleteQuestion(quizId, id);
      
      // Remove the deleted question from the questions array if it exists there
      if (questions.value.length) {
        questions.value = questions.value.filter(q => q.id !== id);
      }
      
      return result;
    } catch (err) {
      throw (err);
    } finally {
      loading.value = false;
    }
  };
  
  const getQuestion = async (quizId: number, id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await questionApi.GetQuestion(quizId, id);
      question.value = result;
      return result;
    } catch (err) {
      throw (err);
    } finally {
      loading.value = false;
    }
  };
  
  const getQuestions = async (quizId: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await questionApi.GetQuestions(quizId);
      questions.value = result;
      return result;
    } catch (err) {
      throw (err);
    } finally {
      loading.value = false;
    }
  };
  
  return {
    loading,
    error,
    question,
    questions,
    clearError,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestion,
    getQuestions
  };
}