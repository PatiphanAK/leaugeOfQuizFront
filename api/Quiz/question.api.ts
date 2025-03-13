import type { CreateUpdateQuestionData } from "~/types/Quiz/quiz.interface";
import { Helper } from "~/utils/helper";
import axios from 'axios';

const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const helper = new Helper();

export default function QuestionAPI() {
  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
    }
  });
  
  return {
    CreateQuestion: async (quizId: number,data: CreateUpdateQuestionData) => {
      try {
        const response = await api.post(`/quizzes/${quizId}/questions/`);
        return response.data;
      } catch (error) {
        throw (error);
      }
    },
    
    UpdateQuestion: async (id: number, data: CreateUpdateQuestionData) => {
      try {
        const response = await api.put(`/questions/${id}`, data);
        return response.data;
      } catch (error) {
        throw (error);
      }
    },
    
    DeleteQuestion: async (quizId : number,id: number) => {
      try {
        const response = await api.delete(`/quizzes/${quizId}/questions/${id}`);
        return response.data;
      } catch (error) {
        throw (error);
      }
    },
    
    GetQuestion: async (quizId : number,id: number) => {
      try {
        const response = await api.get(`/quizzes/${quizId}/questions/${id}`);
        return response.data;
      } catch (error) {
        throw (error);
      }
    },
    
    GetQuestions: async (quizId: number) => {
      try {
        const response = await api.get(`/quizzes/${quizId}/questions`);
        return response.data;
      } catch (error) {
        throw (error);
      }
    }
  };
}
