import axios from 'axios';
import websocketService from '~/api/Websocket/websocket.service';
import type { 
  GameSession, 
  GamePlayer,
  Quiz,
  JoinSessionPayload,
  GameActionPayload,
  SubmitAnswerPayload,
  ChatMessagePayload
} from '@/types/Game/game.interface';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

interface WSJoinSessionPayload {
  sessionId: string;
  userId: number;
  nickname: string;
}

interface WSGameActionPayload {
  sessionId: string;
  userId: number;
}

interface WSSubmitAnswerPayload {
  sessionId: string;
  userId: number;
  questionId: number;
  choiceId: number;
  timeSpent: number;
}

interface WSChatMessagePayload {
  sessionId: string;
  userId: number;
  message: string;
}

const gameAPI = {
  async createGameSession(quizId: number): Promise<GameSession> {
    try {
      console.log('Creating game session for quiz ID:', quizId);
      const response = await axiosInstance.post(`/games/sessions`, { quizId });
      console.log('Game session created, response data:', response.data);
      return response.data.session;
    } catch (error) {
      console.error('Error creating game session:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
      throw error;
    }
  },

  async getGameSessions(hostOnly: boolean = false): Promise<GameSession[]> {
    const response = await axiosInstance.get(`/games/sessions`, {
      params: { hostOnly }
    });
    return response.data.sessions;
  },

  async getGameSessionDetail(sessionId: string): Promise<{session: GameSession, players: GamePlayer[]}> {
    const response = await axiosInstance.get(`/games/sessions/${sessionId}`);
    return response.data;
  },

  async getGameResults(sessionId: string): Promise<{session: GameSession, players: GamePlayer[]}> {
    const response = await axiosInstance.get(`/games/sessions/${sessionId}/results`);
    return response.data;
  },

  async getQuizzes(page: number = 1, limit: number = 10, isPublished: boolean = true): Promise<{data: Quiz[], meta: any}> {
    const response = await axiosInstance.get(`/quizzes`, {
      params: { page, limit, isPublished: isPublished ? 'true' : 'false' }
    });
    return response.data;
  }
};

const wsApi = {
  connect(): Promise<boolean> {
    return websocketService.connect();
  },

  disconnect(): void {
    websocketService.disconnect();
  },

  joinSession(payload: WSJoinSessionPayload): boolean {
    console.log('Joining session with payload:', payload);
    // ตรวจสอบ sessionId ว่าไม่ว่างเปล่า
    if (!payload.sessionId) {
      console.error('Cannot join session: sessionId is empty');
      return false;
    }
    
    return websocketService.send({
      action: 'join_session',
      payload
    });
  },

  startGame(payload: WSGameActionPayload): boolean {
    return websocketService.send({
      action: 'start_game',
      payload
    });
  },

  submitAnswer(payload: WSSubmitAnswerPayload): boolean {
    return websocketService.send({
      action: 'submit_answer',
      payload
    });
  },

  endGame(payload: WSGameActionPayload): boolean {
    return websocketService.send({
      action: 'end_game',
      payload
    });
  },

  sendChatMessage(payload: WSChatMessagePayload): boolean {
    return websocketService.send({
      action: 'chat_message',
      payload
    });
  },

  on<T>(eventType: string, callback: (payload: T) => void): () => void {
    return websocketService.on<T>(eventType, callback);
  },

  off(eventType: string): void {
    websocketService.off(eventType);
  },

  get isConnected() {
    return websocketService.isConnected;
  }
};

export { gameAPI, wsApi };