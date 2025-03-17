import { ref } from 'vue';
import { useGameStore } from '~/stores/Game/useGameStore';
import { useGameSocket } from '~/composables/Game/useGameSocket';
import { useToast } from '~/composables/useToast';
import type { GameSession, Player, PlayerAnswer } from '~/types/Game/game.interface';

export function useGame() {
  const gameStore = useGameStore();
  const gameSocket = useGameSocket();
  const toast = useToast();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * สร้างเกมใหม่
   */
  const createGame = async (quizId: number): Promise<GameSession | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const session = await gameStore.createGameSession(quizId);
      return session;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create game';
      toast.error(error.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * เข้าร่วมเกม
   */
  const joinGame = async (sessionId: string, nickname: string): Promise<Player | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      // เชื่อมต่อ WebSocket ถ้ายังไม่ได้เชื่อมต่อ
      if (!gameSocket.isConnected.value) {
        gameSocket.connect();
      }

      // เข้าร่วมเกมผ่าน REST API
      const player = await gameStore.joinGameSession(sessionId, nickname);
      return player;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to join game';
      toast.error(error.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * เริ่มเกม (สำหรับโฮสต์)
   */
  const startGame = async (sessionId: string): Promise<GameSession | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      // เริ่มเกมผ่าน REST API
      const session = await gameStore.startGameSession(sessionId);
      
      // ถ้าเชื่อมต่อ WebSocket อยู่ แจ้งให้ผู้เล่นคนอื่นรู้ด้วย
      if (gameSocket.isConnected.value) {
        gameSocket.startGame(sessionId);
      }
      
      return session;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start game';
      toast.error(error.value);
      return null;
    } finally {
      isLoading.value = false;
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
  ): Promise<PlayerAnswer | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await gameStore.submitAnswer(sessionId, questionId, choiceId, timeSpent);
      
      // ถ้าเชื่อมต่อ WebSocket อยู่ แจ้งให้ผู้เล่นคนอื่นรู้ด้วย
      if (gameSocket.isConnected.value) {
        gameSocket.submitAnswer(sessionId, questionId, choiceId, timeSpent);
      }
      
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit answer';
      toast.error(error.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * จบเกม (สำหรับโฮสต์)
   */
  const endGame = async (sessionId: string): Promise<GameSession | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const session = await gameStore.endGameSession(sessionId);
      
      // ถ้าเชื่อมต่อ WebSocket อยู่ แจ้งให้ผู้เล่นคนอื่นรู้ด้วย
      if (gameSocket.isConnected.value) {
        gameSocket.endGame(sessionId);
      }
      
      return session;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to end game';
      toast.error(error.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * ดึงผลลัพธ์ของเกม
   */
  const getGameResults = async (sessionId: string): Promise<GameSession | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const results = await gameStore.getGameResults(sessionId);
      return results;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get game results';
      toast.error(error.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    endGame,
    getGameResults
  };
}