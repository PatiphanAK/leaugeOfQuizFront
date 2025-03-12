import { ref } from 'vue';
import type { 
  Quiz, 
  Category, 
  CreateUpdateQuizData,
} from "~/types/Quiz/quiz.interface";
import QuizAPI, { type QuizParams, type PaginationResult } from "~/api/Quiz/quiz.api";

export default function useQuiz() {
  const api = QuizAPI();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const categories = ref<Category[]>([]);

  const fetchQuizAll = async (params?: QuizParams): Promise<PaginationResult<Quiz>> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.fetchQuizAll(params);
      return response;
    } catch (err) {
      error.value = 'Failed to fetch quizzes';
      console.error('Failed to get quizzes:', err);
      return {
        data: [],
        meta: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10
        }
      };
    } finally {
      loading.value = false;
    }
  };
  
  const fetchMyQuizzes = async (params?: QuizParams): Promise<PaginationResult<Quiz>> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.fetchMyQuizzes(params);
      return response;
    } catch (err) {
      error.value = 'Failed to fetch your quizzes';
      console.error('Failed to get my quizzes:', err);
      return {
        data: [],
        meta: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10
        }
      };
    } finally {
      loading.value = false;
    }
  };
  
  const fetchQuizById = async (id: number): Promise<Quiz | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.fetchQuizById(id);
      return response;
    } catch (err) {
      error.value = 'Failed to fetch quiz details';
      console.error('Failed to get quiz:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async (): Promise<Category[]> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.fetchCategories();
      categories.value = response;
      return response;
    } catch (err) {
      error.value = 'Failed to fetch categories';
      console.error('Failed to get categories:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const createQuiz = async (params: CreateUpdateQuizData | FormData): Promise<Quiz | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.createQuiz(params as CreateUpdateQuizData);
      return response;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateQuiz = async (id: number, params: CreateUpdateQuizData | FormData): Promise<Quiz | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.updateQuiz(id, params as CreateUpdateQuizData);
      return response;
    }
    catch (err) {
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  const deleteQuiz = async (id: number): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.deleteQuiz(id);
      return response;
    }
    catch (err) {
      console.error(err);
      return false;
    }
    finally {
      loading.value = false;
    }
  };
  return {
    // Quiz operations
    fetchQuizAll,
    fetchQuizById,
    fetchMyQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,

    // Category operations
    fetchCategories,
    
    
    // State
    loading,
    error,
    categories
  };
}