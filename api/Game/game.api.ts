import type { GameSession, Player, PlayerAnswer, ApiResponse } from '~/types/Game/game.interface';

const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const gameAPI = {
  /**
   * สร้าง game session ใหม่
   */
  async createGameSession(quizId: number): Promise<ApiResponse<GameSession>> {
    try {
      const { data, error } = await useFetch<ApiResponse<GameSession>>(`${BASE_URL}/api/v1/games/sessions`, {
        method: 'POST',
        body: { quizId },
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<GameSession>;
    } catch (error) {
      console.error('Failed to create game session:', error);
      throw error;
    }
  },

  /**
   * ดึงรายการ game sessions ทั้งหมด
   */
  async getGameSessions(): Promise<ApiResponse<GameSession[]>> {
    try {
      const { data, error } = await useFetch<ApiResponse<GameSession[]>>(`${BASE_URL}/api/v1/games/sessions`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<GameSession[]>;
    } catch (error) {
      console.error('Failed to get game sessions:', error);
      throw error;
    }
  },

  /**
   * ดึงข้อมูล game session เฉพาะ
   */
  async getGameSession(sessionId: string): Promise<ApiResponse<GameSession>> {
    try {
      const { data, error } = await useFetch<ApiResponse<GameSession>>(`${BASE_URL}/api/v1/games/sessions/${sessionId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<GameSession>;
    } catch (error) {
      console.error('Failed to get game session:', error);
      throw error;
    }
  },

  /**
   * เข้าร่วม game session
   */
  async joinGameSession(sessionId: string, nickname: string): Promise<ApiResponse<Player>> {
    try {
      const { data, error } = await useFetch<ApiResponse<Player>>(`${BASE_URL}/api/v1/games/sessions/${sessionId}/join`, {
        method: 'POST',
        body: { nickname },
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<Player>;
    } catch (error) {
      console.error('Failed to join game session:', error);
      throw error;
    }
  },

  /**
   * เริ่ม game
   */
  async startGameSession(sessionId: string): Promise<ApiResponse<GameSession>> {
    try {
      const { data, error } = await useFetch<ApiResponse<GameSession>>(`${BASE_URL}/api/v1/games/sessions/${sessionId}/start`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<GameSession>;
    } catch (error) {
      console.error('Failed to start game session:', error);
      throw error;
    }
  },

  /**
   * จบ game
   */
  async endGameSession(sessionId: string): Promise<ApiResponse<GameSession>> {
    try {
      const { data, error } = await useFetch<ApiResponse<GameSession>>(`${BASE_URL}/api/v1/games/sessions/${sessionId}/end`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<GameSession>;
    } catch (error) {
      console.error('Failed to end game session:', error);
      throw error;
    }
  },

  /**
   * ส่งคำตอบ
   */
  async submitAnswer(
    sessionId: string, 
    questionId: number, 
    choiceId: number, 
    timeSpent: number
  ): Promise<ApiResponse<PlayerAnswer>> {
    try {
      const { data, error } = await useFetch<ApiResponse<PlayerAnswer>>(`${BASE_URL}/api/v1/games/sessions/${sessionId}/answers`, {
        method: 'POST',
        body: {
          questionId,
          choiceId,
          timeSpent
        },
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<PlayerAnswer>;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  },

  /**
   * ดูผลลัพธ์ของเกม
   */
  async getGameResults(sessionId: string): Promise<ApiResponse<GameSession>> {
    try {
      const { data, error } = await useFetch<ApiResponse<GameSession>>(`${BASE_URL}/api/v1/games/sessions/${sessionId}/results`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value as ApiResponse<GameSession>;
    } catch (error) {
      console.error('Failed to get game results:', error);
      throw error;
    }
  }
};