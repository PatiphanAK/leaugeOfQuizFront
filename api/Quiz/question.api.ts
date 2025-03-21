import type { CreateUpdateQuestionData } from "~/types/Quiz/quiz.interface";
import axios from 'axios';

const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function QuestionAPI() {
  const api = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
    }
  });
  
  return {
    CreateQuestion: async (quizId: number, data: CreateUpdateQuestionData | FormData) => {
      try {
        let formData: FormData;
        if (!(data instanceof FormData)) {
          formData = new FormData();
          formData.append('quizId', quizId.toString());
          formData.append('text', data.Text);
          if (data.ImageURL instanceof File) {
            formData.append('image', data.ImageURL);
          }
        } else {
          formData = data;
        }
        
        const response = await api.post(`/quizzes/${quizId}/questions`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        throw (error);
      }
    },
    
    UpdateQuestion: async (id: number, data: CreateUpdateQuestionData | FormData) => {
      try {
        let formData: FormData;
        let quizId: number;
        
        if (!(data instanceof FormData)) {
          formData = new FormData();
          formData.append('text', data.Text);
          quizId = data.QuizID;
          if (data.ImageURL instanceof File) {
            formData.append('image', data.ImageURL);
          }
        } else {
          formData = data;
          const quizIdValue = formData.get('quizId');
          quizId = quizIdValue ? parseInt(quizIdValue.toString()) : 0;
        }
        
        const response = await api.patch(`/quizzes/${quizId}/questions/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        throw (error);
      }
    },
    
    DeleteQuestion: async (quizId: number, id: number) => {
      try {
        const response = await api.delete(`/quizzes/${quizId}/questions/${id}`);
        return response.data;
      } catch (error) {
        throw (error);
      }
    },
    
    GetQuestion: async (quizId: number, id: number) => {
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