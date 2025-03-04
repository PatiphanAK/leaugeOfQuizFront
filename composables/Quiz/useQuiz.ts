import type { Quiz } from "~/types/Quiz/quiz.interface";
import QuizAPI, { type QuizParams, type PaginationResult } from "~/api/Quiz/quiz.api";

export default function useQuiz() {
  const api = QuizAPI();

  const fetchQuizAll = async (params?: QuizParams): Promise<PaginationResult<Quiz>> => {
    try {
      const response = await api.fetchQuizAll(params);
      return response;
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
  };
  
  const fetchQuizById = async (id: number): Promise<Quiz | null> => {
    try {
      const response = await api.fetchQuizById(id);
      return response;
    } catch (error) {
      console.error('Failed to get quiz:', error);
      return null;
    }
  };

  const createQuiz = async (quizData: Partial<Quiz>): Promise<Quiz | null> => {
    try {
      const response = await api.createQuiz(quizData);
      return response;
    } catch (error) {
      console.error('Failed to create quiz:', error);
      return null;
    }
  };
  
  const updateQuiz = async (id: number, quizData: Partial<Quiz>): Promise<Quiz | null> => {
    try {
      const response = await api.updateQuiz(id, quizData);
      return response;
    } catch (error) {
      console.error('Failed to update quiz:', error);
      return null;
    }
  };
  
  const deleteQuiz = async (id: number): Promise<boolean> => {
    try {
      const response = await api.deleteQuiz(id);
      return response;
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      return false;
    }
  };

  const fetchQuizCategories = async (): Promise<{ id: number, name: string }[]> => {
    try {
      const response = await api.fetchQuizCategories();
      return response;
    } catch (error) {
      console.error('Failed to fetch quiz categories:', error);
      return [];
    }
  };

  // เพิ่มฟังก์ชัน helper สำหรับ pagination
  const getPaginationInfo = (total: number, limit: number, offset: number) => {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    
    return {
      totalPages,
      currentPage,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  };
  
  return {
    fetchQuizAll,
    fetchQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    fetchQuizCategories,
    getPaginationInfo
  };
}