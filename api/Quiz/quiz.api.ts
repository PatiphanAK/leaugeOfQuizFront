import type { Quiz, Question, Choice } from "~/types/Quiz/quiz.interface";
import { objectToFormData } from "@/utils/formData"
import axios from 'axios';

export interface QuizParams {
  page?: number;
  limit?: number;
  published?: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  }
}

const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function QuizAPI() {
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
    }
  });

  /**
   * สร้าง query params จากพารามิเตอร์
   */
  const buildQueryParams = (params: QuizParams): Record<string, any> => {
    const queryParams: Record<string, any> = {};
    
    if (params.page !== undefined) {
      queryParams.page = params.page;
    }
    
    if (params.limit !== undefined) {
      queryParams.limit = params.limit;
    }
    
    if (params.published !== undefined) {
      queryParams.published = params.published.toString();
    }
    
    return queryParams;
  };

  return {
    // Fetch all quizzes
    fetchQuizAll: async (params?: QuizParams): Promise<PaginationResult<Quiz>> => {
      try {
        const queryParams = params ? buildQueryParams(params) : {};
        const response = await api.get('/api/v1/quizzes', { params: queryParams });
        
        return response.data || { 
          data: [], 
          meta: {
            total: 0,
            page: params?.page || 0,
            limit: params?.limit || 10
          }
        };
      } catch (error) {
        console.error('Failed to get quizzes:', error);
        return {
          data: [],
          meta: {
            total: 0,
            page: params?.page || 0,
            limit: params?.limit || 10
          }
        };
      }
    },

    // Fetch quiz by ID
    fetchQuizById: async (id: number): Promise<Quiz | null> => {
      try {
        const response = await api.get(`/api/v1/quizzes/${id}`);
        return response.data.data || null;
      } catch (error) {
        console.error('Failed to get quiz:', error);
        return null;
      }
    },

    // Fetch user's quizzes
    fetchMyQuizzes: async (params?: QuizParams): Promise<PaginationResult<Quiz>> => {
      try {
        const queryParams = params ? buildQueryParams(params) : {};
        const response = await api.get('/api/v1/quizzes/my', { params: queryParams });
        
        return response.data || { 
          data: [], 
          meta: {
            total: 0,
            page: params?.page || 0,
            limit: params?.limit || 10
          }
        };
      } catch (error) {
        console.error('Failed to get my quizzes:', error);
        return {
          data: [],
          meta: {
            total: 0,
            page: params?.page || 0,
            limit: params?.limit || 10
          }
        };
      }
    },

    // Create a new quiz with FormData
    createQuizWithForm: async (quizData: {
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
    }, files: {
      quizImage?: File;
      questionImages?: File[];
      choiceImages?: Array<Array<File | null>>;
    }): Promise<Quiz | null> => {
      try {
        const formData = new FormData();
        
        // Add quiz data as JSON string
        formData.append('quizData', JSON.stringify(quizData));
        
        // Add quiz image if exists
        if (files.quizImage) {
          formData.append('quizImage', files.quizImage);
        }
        
        // Add question images if exist
        if (files.questionImages) {
          files.questionImages.forEach((image, i) => {
            if (image) {
              formData.append(`questionImage_${i}`, image);
            }
          });
        }
        
        // Add choice images if exist
        if (files.choiceImages) {
          files.choiceImages.forEach((choiceImageRow, i) => {
            choiceImageRow.forEach((image, j) => {
              if (image) {
                formData.append(`choiceImage_${i}_${j}`, image);
              }
            });
          });
        }
        
        const response = await api.post('/api/v1/quizzes/form', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data.data || null;
      } catch (error) {
        console.error('Failed to create quiz:', error);
        return null;
      }
    },

    // Create a new quiz with JSON
    createQuiz: async (quizData: {
      title: string;
      description: string;
      timeLimit: number;
      isPublished: boolean;
      imageURL?: string;
      categories: number[];
      questions: Array<{
        text: string;
        imageURL?: string;
        choices: Array<{
          text: string;
          imageURL?: string;
          isCorrect: boolean;
        }>
      }>
    }): Promise<Quiz | null> => {
      try {
        const response = await api.post('/api/v1/quizzes', quizData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        return response.data.data || null;
      } catch (error) {
        console.error('Failed to create quiz:', error);
        return null;
      }
    },

    // Update an existing quiz
    updateQuiz: async (id: number, quizData: Partial<Quiz>): Promise<Quiz | null> => {
      try {
        const response = await api.patch(`/api/v1/quizzes/${id}`, quizData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        return response.data.data || null;
      } catch (error) {
        console.error('Failed to update quiz:', error);
        return null;
      }
    },

    // Delete a quiz
    deleteQuiz: async (id: number): Promise<boolean> => {
      try {
        const response = await api.delete(`/api/v1/quizzes/${id}`);
        return response.data.message?.includes('success') || false;
      } catch (error) {
        console.error('Failed to delete quiz:', error);
        return false;
      }
    },

    // Upload a file (for separate file uploads)
    uploadFile: async (file: File, type: 'quiz' | 'question' | 'choice', oldFileURL?: string): Promise<string | null> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        if (oldFileURL) {
          formData.append('old_file_url', oldFileURL);
        }
        
        const response = await api.post(`/api/upload/${type}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data.url || null;
      } catch (error) {
        console.error(`Failed to upload ${type} file:`, error);
        return null;
      }
    }
  };
}