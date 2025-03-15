// useGameStore.ts
import { defineStore } from 'pinia';
import { gameAPI } from '~/api/Game/game.api';
import type { GameSession, Player } from '~/types/Game/game.interface';

export const useGameStore = defineStore('game', () => {
  const state = reactive({
    currentSession: null as GameSession | null,
    player: null as Player | null,
    loading: false,
  });

  /**
   * สร้าง game session ใหม่
   */
  const createGameSession = async (quizId: number) => {
    state.loading = true;
    try {
      const response = await gameAPI.createGameSession(quizId);
      
      if (!response || !response.session) {
        throw new Error('Invalid response from server');
      }
      
      // Make sure session has Players array initialized
      if (!response.session.Players) {
        response.session.Players = [];
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in createGameSession:', error);
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * ดึงข้อมูล game session เฉพาะ
   */
  const getGameSession = async (sessionId: string) => {
    state.loading = true;
    try {
      const response = await gameAPI.getGameSession(sessionId);
      
      if (!response || !response.session) {
        throw new Error('Invalid response from server');
      }
      
      // Make sure session has Players array initialized
      if (!response.session.Players) {
        response.session.Players = [];
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in getGameSession:', error);
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * เข้าร่วม game session
   */
  const joinGameSession = async (sessionId: string, nickname: string) => {
    state.loading = true;
    try {
      const response = await gameAPI.joinGameSession(sessionId, nickname);
      
      if (!response || !response.player) {
        throw new Error('Invalid response from server');
      }
      
      state.player = response.player;
      return response.player;
    } catch (error) {
      console.error('Error in joinGameSession:', error);
      throw error;
    } finally {
      state.loading = false;
    }
  };

  /**
   * เริ่ม game
   */
  const startGameSession = async (sessionId: string) => {
    state.loading = true;
    try {
      const response = await gameAPI.startGameSession(sessionId);
      
      if (!response || !response.session) {
        throw new Error('Invalid response from server');
      }
      
      state.currentSession = response.session;
      return response.session;
    } catch (error) {
      console.error('Error in startGameSession:', error);
      throw error;
    } finally {
      state.loading = false;
    }
  };

  return {
    state,
    createGameSession,
    getGameSession,
    joinGameSession,
    startGameSession
    // Add other methods as needed
  };
});