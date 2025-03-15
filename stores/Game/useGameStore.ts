import { defineStore } from 'pinia';
import type { GameSession, Player, Question, ChatMessage } from '~/types/Game/game.interface';
import { gameAPI } from '~/api/Game/game.api';
import { useAuthStore } from '@/stores/Auth/useAuthStore';

export const useGameStore = defineStore('game', {
  state: () => ({
    isLoading: false,
    error: null as string | null,
    currentSession: null as GameSession | null,
    players: [] as Player[],
    currentQuestion: null as Question | null,
    questionStartTime: null as number | null,
    timeLimit: 0,
    hasAnswered: false,
    chatMessages: [] as ChatMessage[]
  }),

  getters: {
    isHost: (state) => {
      const authStore = useAuthStore();
      return state.currentSession?.hostId === authStore.user?.id;
    },
    
    remainingTime: (state) => {
      if (!state.questionStartTime || !state.timeLimit) return 0;
      
      const elapsed = (Date.now() - state.questionStartTime) / 1000;
      return Math.max(0, state.timeLimit - elapsed);
    },
    
    gameStatus: (state) => state.currentSession?.status || 'lobby'
  },

  actions: {
    async createGameSession(quizId: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await gameAPI.createGameSession(quizId);
        this.currentSession = response.data;
        this.players = response.data.players || [];
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Failed to create game session';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async getGameSession(sessionId: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await gameAPI.getGameSession(sessionId);
        this.currentSession = response.data;
        this.players = response.data.players || [];
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Failed to get game session';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async joinGameSession(sessionId: string, nickname: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await gameAPI.joinGameSession(sessionId, nickname);
        // ไม่ต้อง update state ที่นี่เพราะเราจะได้รับข้อมูลผ่าน WebSocket
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Failed to join game session';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async startGameSession(sessionId: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await gameAPI.startGameSession(sessionId);
        // ไม่ต้อง update state ที่นี่เพราะเราจะได้รับข้อมูลผ่าน WebSocket
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Failed to start game session';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async endGameSession(sessionId: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await gameAPI.endGameSession(sessionId);
        // ไม่ต้อง update state ที่นี่เพราะเราจะได้รับข้อมูลผ่าน WebSocket
        return response.data;
      } catch (error: any) {
        this.error = error.message || 'Failed to end game session';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async submitAnswer(sessionId: string, questionId: number, choiceId: number, timeSpent: number) {
      this.isLoading = true;
      this.error = null;
      
      try {
        this.hasAnswered = true; // ตั้งค่าทันทีเพื่อป้องกันการกดหลายครั้ง
        
        const response = await gameAPI.submitAnswer(sessionId, questionId, choiceId, timeSpent);
        return response.data;
      } catch (error: any) {
        this.hasAnswered = false; // กลับไปเป็น false ในกรณีที่มีข้อผิดพลาด
        this.error = error.message || 'Failed to submit answer';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    // ฟังก์ชันสำหรับจัดการข้อมูลจาก WebSocket
    updateSession(session: GameSession) {
      this.currentSession = session;
    },
    
    updatePlayers(players: Player[]) {
      this.players = players;
    },
    
    addPlayer(player: Player) {
      // ตรวจสอบว่ามีผู้เล่นนี้อยู่แล้วหรือไม่
      const index = this.players.findIndex(p => p.id === player.id);
      
      if (index === -1) {
        // เพิ่มผู้เล่นใหม่
        this.players.push(player);
      } else {
        // อัพเดทข้อมูลผู้เล่น
        this.players[index] = player;
      }
    },
    
    startQuestion(question: Question, timeLimit: number) {
      this.currentQuestion = question;
      this.timeLimit = timeLimit;
      this.questionStartTime = Date.now();
      this.hasAnswered = false;
    },
    
    endQuestion() {
      this.currentQuestion = null;
      this.questionStartTime = null;
    },
    
    addChatMessage(message: ChatMessage) {
      this.chatMessages.push(message);
    },
    
    reset() {
      this.currentSession = null;
      this.players = [];
      this.currentQuestion = null;
      this.questionStartTime = null;
      this.timeLimit = 0;
      this.hasAnswered = false;
      this.chatMessages = [];
      this.error = null;
    }
  }
});