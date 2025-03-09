import { ref } from 'vue';
import type { Quiz, Question, Choice, Category } from "~/types/Quiz/quiz.interface";
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

  const createQuiz = async (
    quizData: {
      title: string;
      description: string;
      timeLimit: number;
      isPublished: boolean;
      categories: number[];
      questions: Array<{
        text: string;
        choices: Array<{
          text: string;
          isCorrect: boolean;
        }>
      }>
    },
    files?: {
      quizImage?: File;
      questionImages?: File[];
      choiceImages?: Array<Array<File | null>>;
    }
  ): Promise<Quiz | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      let response;
      if (files && (files.quizImage || files.questionImages || files.choiceImages)) {
        // Use FormData approach if there are files
        response = await api.createQuizWithForm(quizData, files);
      } else {
        // Use JSON approach if there are no files
        response = await api.createQuiz(quizData);
      }
      return response;
    } catch (err) {
      error.value = 'Failed to create quiz';
      console.error('Failed to create quiz:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const updateQuiz = async (id: number, quizData: Partial<Quiz>): Promise<Quiz | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.updateQuiz(id, quizData);
      return response;
    } catch (err) {
      error.value = 'Failed to update quiz';
      console.error('Failed to update quiz:', err);
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
    } catch (err) {
      error.value = 'Failed to delete quiz';
      console.error('Failed to delete quiz:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const uploadFile = async (file: File, type: 'quiz' | 'question' | 'choice', oldFileURL?: string): Promise<string | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.uploadFile(file, type, oldFileURL);
      return response;
    } catch (err) {
      error.value = 'Failed to upload file';
      console.error('Failed to upload file:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteFile = async (filename: string, type: 'quiz' | 'question' | 'choice'): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.deleteFile(filename, type);
      return response;
    } catch (err) {
      error.value = 'Failed to delete file';
      console.error('Failed to delete file:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    fetchQuizAll,
    fetchQuizById,
    fetchMyQuizzes,
    fetchCategories,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    uploadFile,
    deleteFile,
    loading,
    error,
    categories
  };
}