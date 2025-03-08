import type { Quiz } from "~/types/Quiz/quiz.interface";
import { objectToFormData } from "@/utils/formData"
import axios from 'axios';

export interface QuizParams {
  search?: string;
  categories?: number[] | string[];
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
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
    
    if (params.search) {
      queryParams.search = params.search;
    }
    
    if (params.categories && params.categories.length > 0) {
      queryParams.categories = params.categories;
    }
    
    if (params.limit) {
      queryParams.limit = params.limit;
    }
    
    if (params.offset !== undefined) {
      queryParams.offset = params.offset;
    }
    
    if (params.sort) {
      queryParams.sort = params.sort;
    }
    
    if (params.order) {
      queryParams.order = params.order;
    }
    
    return queryParams;
  };

  return {
    // Fetch all quizzes
    fetchQuizAll: async (params?: QuizParams): Promise<PaginationResult<Quiz>> => {
      try {
        const queryParams = params ? buildQueryParams(params) : {};
        const response = await api.get('/api/quiz', { params: queryParams });
        
        // ปรับรูปแบบการส่งคืนข้อมูลให้เป็น PaginationResult
        const result = response.data || { 
          quizzes: [], 
          total: 0, 
          limit: params?.limit || 10, 
          offset: params?.offset || 0 
        };
        
        return {
          data: result.quizzes || [],
          total: result.total || 0,
          limit: result.limit || params?.limit || 10,
          offset: result.offset || params?.offset || 0,
          hasMore: result.total > (result.offset + result.limit)
        };
      } catch (error) {
        console.error('Failed to get quizzes:', error);
        return {
          data: [],
          total: 0,
          limit: params?.limit || 10,
          offset: params?.offset || 0,
          hasMore: false
        };
      }
    },

    // Fetch quiz by ID
    fetchQuizById: async (id: number): Promise<Quiz | null> => {
      try {
        const response = await api.get(`/api/quiz/${id}`);
        return response.data.quiz || null;
      } catch (error) {
        console.error('Failed to get quiz:', error);
        return null;
      }
    },

    // Create a new quiz
    createQuiz: async (quizData: Partial<Quiz>): Promise<Quiz | null> => {
      try {
        const formData = objectToFormData(quizData);
        const response = await api.post('/api/quiz', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        return response.data.quiz || null;
      } catch (error) {
        console.error('Failed to create quiz:', error);
        return null;
      }
    },

    // Update an existing quiz
    updateQuiz: async (id: number, quizData: Partial<Quiz>): Promise<Quiz | null> => {
      try {
        const response = await api.put(`/api/quiz/${id}`, quizData
          , {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        return response.data.quiz || null;
      } catch (error) {
        console.error('Failed to update quiz:', error);
        return null;
      }
    },

    // Delete a quiz
    deleteQuiz: async (id: number): Promise<boolean> => {
      try {
        await api.delete(`/api/quiz/${id}`);
        return true;
      } catch (error) {
        console.error('Failed to delete quiz:', error);
        return false;
      }
    },

    // ดึงหมวดหมู่ทั้งหมดของควิซ
    fetchQuizCategories: async (): Promise<{ id: number, name: string }[]> => {
      try {
        const response = await api.get('/api/quiz/categories');
        return response.data?.categories || [];
      } catch (error) {
        console.error('Failed to fetch quiz categories:', error);
        return [];
      }
    }
  };
}