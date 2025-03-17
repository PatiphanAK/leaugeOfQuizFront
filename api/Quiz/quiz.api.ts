import type { Quiz, Category, CreateUpdateQuizData } from "~/types/Quiz/quiz.interface";
import  { Helper} from "~/utils/helper";
import axios from 'axios';

export interface QuizParams {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  search?: string;
  categories?: number[];
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
const helper = new Helper();

export default function QuizAPI() {
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
    }
  });
  const buildQueryParams = (params: QuizParams): Record<string, any> => {
    const queryParams: Record<string, any> = {};
    
    if (params.page !== undefined) {
      queryParams.page = params.page;
    }
    
    if (params.limit !== undefined) {
      queryParams.limit = params.limit;
    }
    
    if (params.isPublished !== undefined) {
      queryParams.isPublished = params.isPublished.toString();
    }
    
    if (params.search !== undefined && params.search.trim() !== '') {
      queryParams.search = params.search;
    }
    
    if (params.categories !== undefined && params.categories.length > 0) {
      queryParams.categories = params.categories.join(',');
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
            page: params?.page || 1,
            limit: params?.limit || 10
          }
        };
      } catch (error) {
        console.error('Failed to get quizzes:', error);
        return {
          data: [],
          meta: {
            total: 0,
            page: params?.page || 1,
            limit: params?.limit || 10
          }
        };
      }
    },
    fetchQuizById: async (id: number): Promise<Quiz | null> => {
      try {
        const response = await api.get(`/api/v1/quizzes/${id}`);
        return response.data.data || null;
      } catch (error) {
        console.error('Failed to get quiz:', error);
        return null;
      }
    },
    fetchMyQuizzes: async (params?: QuizParams): Promise<PaginationResult<Quiz>> => {
      try {
        const queryParams = params ? buildQueryParams(params) : {};
        const response = await api.get('/api/v1/quizzes/my', { params: queryParams });
        
        return response.data || { 
          data: [], 
          meta: {
            total: 0,
            page: params?.page || 1,
            limit: params?.limit || 10
          }
        };
      } catch (error) {
        console.error('Failed to get my quizzes:', error);
        return {
          data: [],
          meta: {
            total: 0,
            page: params?.page || 1,
            limit: params?.limit || 10
          }
        };
      }
    },

    // Fetch all categories
    fetchCategories: async (): Promise<Category[]> => {
      try {
        const response = await api.get('/api/v1/quizzes/categories');
        return response.data.categories || [];
      } catch (error) {
        console.error('Failed to get categories:', error);
        return [];
      }
    },
    createQuiz: async(params: CreateUpdateQuizData): Promise<Quiz | null> => {
      try {
        // แปลง object เป็น FormData ด้วยฟังก์ชัน helper
        const formData = helper.createFormDataFromObject({
          title: params.Title,
          description: params.Description,
          timeLimit: params.TimeLimit,
          isPublished: params.IsPublished,
          categories: params.Categories,
          imageURL: params.ImageURL || null
        });
        
        const response = await api.post('/api/v1/quizzes', formData);
        return response.data.data || null;
      }
      catch (error) {
        console.error('Failed to create quiz:', error);
        return null;
      }
    },
    
    updateQuiz: async (id: number, params: CreateUpdateQuizData): Promise<Quiz | null> => {
      try {
        // ใช้ฟังก์ชันเดียวกันกับที่ใช้ใน createQuiz
        const formData = helper.createFormDataFromObject({
          title: params.Title,
          description: params.Description,
          timeLimit: params.TimeLimit,
          isPublished: params.IsPublished,
          categories: params.Categories,
          imageURL: params.ImageURL || null
        });
        
        const response = await api.patch(`/api/v1/quizzes/${id}`, formData);
        return response.data.data || null;
      } catch (error) {
        console.error('Failed to update quiz:', error);
        return null;
      }
    },
    deleteQuiz: async (id: number): Promise<boolean> => {
      try {
        const response = await api.delete(`/api/v1/quizzes/${id}`);
        return response.status === 204;
      }
      catch (error) {
        console.error('Failed to delete quiz:', error);
        return false;
      }
    }
  };
}