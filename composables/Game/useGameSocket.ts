import { defineStore } from 'pinia';
import { gameAPI } from '~/api/Game/game.api';
import type { GameSession, Player, PlayerAnswer } from '~/types/Game/game.interface';

export const useGameStore = defineStore('game', () => {
  const state = reactive({
    currentSession: null as GameSession | null,
    player: null as Player | null,
    loading: false,
    error: null as string | null
  });

  /**
   * สร้าง game session ใหม่
   */
  const createGameSession = async (quizId: number): Promise<GameSession> => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await gameAPI.createGameSession(quizId);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Invalid response from server');
      }
      
      // Make sure session has Players array initialized
      if (!response.session.Players) {
        response.session.Players = [];
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in createGameSession:', error);
      state.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * ดึงข้อมูล game session เฉพาะ
   */
  const getGameSession = async (sessionId: string): Promise<GameSession> => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await gameAPI.getGameSession(sessionId);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Invalid response from server');
      }
      
      // Make sure session has Players array initialized
      if (!response.session.Players) {
        response.session.Players = [];
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in getGameSession:', error);
      state.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * เข้าร่วม game session
   */
  const joinGameSession = async (sessionId: string, nickname: string): Promise<Player> => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await gameAPI.joinGameSession(sessionId, nickname);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Invalid response from server');
      }
      
      state.player = response.player;
      return response.player;
    } catch (error) {
      console.error('Error in joinGameSession:', error);
      state.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * เริ่ม game
   */
  const startGameSession = async (sessionId: string): Promise<GameSession> => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await gameAPI.startGameSession(sessionId);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Invalid response from server');
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in startGameSession:', error);
      state.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * ส่งคำตอบ
   */
  const submitAnswer = async (
    sessionId: string, 
    questionId: number, 
    choiceId: number, 
    timeSpent: number
  ): Promise<PlayerAnswer> => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await gameAPI.submitAnswer(
        sessionId, 
        questionId, 
        choiceId, 
        timeSpent
      );
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Invalid response from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in submitAnswer:', error);
      state.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * จบเกม
   */
  const endGameSession = async (sessionId: string): Promise<GameSession> => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await gameAPI.endGameSession(sessionId);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Invalid response from server');
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in endGameSession:', error);
      state.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * ดึงผลลัพธ์เกม
   */
  const getGameResults = async (sessionId: string): Promise<GameSession> => {
    state.loading = true;
    state.error = null;
    
    try {
      const response = await gameAPI.getGameResults(sessionId);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Invalid response from server');
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in getGameResults:', error);
      state.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * รีเซ็ตข้อมูลเกม
   */
  const resetGame = () => {
    state.currentSession = null;
    state.player = null;
    state.error = null;
  };

  // Return the store's public API
  return {
    // State
    state,
    
    // Getters (computed values for convenience)
    loading: computed(() => state.loading),
    currentSession: computed(() => state.currentSession),
    player: computed(() => state.player),
    error: computed(() => state.error),
    
    // Actions/Methods
    createGameSession,
    getGameSession,
    joinGameSession,
    startGameSession,
    submitAnswer,
    endGameSession,
    getGameResults,
    resetGame
  };
});