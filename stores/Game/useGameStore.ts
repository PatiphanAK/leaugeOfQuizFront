import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameSession, GamePlayer, PlayerAnswer, Question, ChatMessagePayload } from '@/types/Game/game.interface';
import { gameAPI } from '~/api/Game/game.api';
import { wsApi } from '~/api/Game/game.api';

export const useGameStore = defineStore('game', () => {
  // State
  const currentSession = ref<GameSession | null>(null);
  const players = ref<GamePlayer[]>([]);
  const currentQuestionIndex = ref<number | null>(null);
  const playerAnswers = ref<PlayerAnswer[]>([]);
  const chatMessages = ref<{userId: number, nickname: string, message: string, timestamp: Date}[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentPlayer = ref<GamePlayer | null>(null);

  // Getters
  const isHost = computed(() => {
    if (!currentSession.value || !currentPlayer.value) return false;
    return currentSession.value.HostID === currentPlayer.value.UserID;
  });

  const currentQuestion = computed(() => {
    if (!currentSession.value?.Quiz?.Questions || currentQuestionIndex.value === null) {
      return null;
    }
    return currentSession.value.Quiz.Questions[currentQuestionIndex.value];
  });

  const gameStatus = computed(() => currentSession.value?.Status || 'lobby');

  const playerResults = computed(() => {
    return [...players.value].sort((a, b) => b.Score - a.Score);
  });

  const isWebSocketConnected = computed(() => wsApi.isConnected.value);

  async function createGameSession(quizId: number) {
    try {
      isLoading.value = true;
      error.value = null;
      
      const session = await gameAPI.createGameSession(quizId);
      currentSession.value = session;
      
      return session;
    } catch (err: any) {
      error.value = err.message || 'Failed to create game session';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadGameSession(sessionId: string) {
    try {
      isLoading.value = true;
      error.value = null;
      
      const { session, players: sessionPlayers } = await gameAPI.getGameSessionDetail(sessionId);
      currentSession.value = session;
      players.value = sessionPlayers;
      
      return { session, players: sessionPlayers };
    } catch (err: any) {
      error.value = err.message || 'Failed to load game session';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadGameResults(sessionId: string) {
    try {
      isLoading.value = true;
      error.value = null;
      
      const { session, players: sessionPlayers } = await gameAPI.getGameResults(sessionId);
      currentSession.value = session;
      players.value = sessionPlayers;
      
      return { session, players: sessionPlayers };
    } catch (err: any) {
      error.value = err.message || 'Failed to load game results';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function connectToWebSocket() {
    try {
      error.value = null;
      return await wsApi.connect();
    } catch (err: any) {
      error.value = err.message || 'Failed to connect to WebSocket';
      throw err;
    }
  }

  function disconnectFromWebSocket() {
    wsApi.disconnect();
  }

  function joinGameSession(sessionId: string, userId: number, nickname: string) {
    return wsApi.joinSession({ sessionId, userId, nickname });
  }

  function startGame(sessionId: string, userId: number) {
    return wsApi.startGame({ sessionId, userId });
  }

  function submitAnswer(sessionId: string, userId: number, questionId: number, choiceId: number, timeSpent: number) {
    return wsApi.submitAnswer({ sessionId, userId, questionId, choiceId, timeSpent });
  }

  function endGame(sessionId: string, userId: number) {
    return wsApi.endGame({ sessionId, userId });
  }

  function sendChatMessage(sessionId: string, userId: number, message: string) {
    return wsApi.sendChatMessage({ sessionId, userId, message });
  }

  // WebSocket event handlers
  function setupWebSocketListeners() {
    // Handle player joined event
    wsApi.on('player_joined', (payload: { player: GamePlayer }) => {
      const existingPlayerIndex = players.value.findIndex(p => p.id === payload.player.id);
      if (existingPlayerIndex === -1) {
        players.value.push(payload.player);
      } else {
        players.value[existingPlayerIndex] = payload.player;
      }
    });

    // Handle game started event
    wsApi.on('game_started', (payload: { session: GameSession }) => {
      currentSession.value = payload.session;
      currentQuestionIndex.value = 0;
    });

    // Handle question started event
    wsApi.on('question_started', (payload: { questionIndex: number, question: Question }) => {
      currentQuestionIndex.value = payload.questionIndex;
    });

    // Handle answer submitted event
    wsApi.on('answer_submitted', (payload: { playerId: number, questionId: number }) => {
      // We don't update the actual answer here to prevent cheating
      // Just log that a player has submitted an answer
      console.log(`Player ${payload.playerId} submitted an answer for question ${payload.questionId}`);
    });

    // Handle question ended event
    wsApi.on('question_ended', (payload: { 
      questionId: number, 
      answers: PlayerAnswer[],
      nextQuestionIndex: number | null 
    }) => {
      // Update player answers
      playerAnswers.value = [...playerAnswers.value, ...payload.answers];
      
      // Update player scores
      for (const answer of payload.answers) {
        const player = players.value.find(p => p.ID === answer.PlayerID);
        if (player) {
          player.Score += answer.Score;
        }
      }
      
      // Move to next question or end game
      currentQuestionIndex.value = payload.nextQuestionIndex;
    });

    // Handle game ended event
    wsApi.on('game_ended', (payload: { session: GameSession, players: GamePlayer[] }) => {
      currentSession.value = payload.session;
      players.value = payload.players;
      currentQuestionIndex.value = null;
    });

    // Handle chat message event
    wsApi.on<ChatMessagePayload & { nickname: string }>('chat_message', (payload) => {
      chatMessages.value.push({
        userId: payload.userId,
        nickname: payload.nickname,
        message: payload.message,
        timestamp: new Date()
      });
    });

    // Handle error messages
    wsApi.on<{ error: string }>('error', (payload) => {
      error.value = payload.error;
    });
  }

  function cleanupWebSocketListeners() {
    wsApi.off('player_joined');
    wsApi.off('game_started');
    wsApi.off('question_started');
    wsApi.off('answer_submitted');
    wsApi.off('question_ended');
    wsApi.off('game_ended');
    wsApi.off('chat_message');
    wsApi.off('error');
  }

  function resetGameState() {
    currentSession.value = null;
    players.value = [];
    currentQuestionIndex.value = null;
    playerAnswers.value = [];
    chatMessages.value = [];
    currentPlayer.value = null;
    error.value = null;
  }

  // Set current player when they successfully join
  wsApi.on<{ player: GamePlayer, session: GameSession }>('joined', (payload) => {
    currentPlayer.value = payload.player;
    currentSession.value = payload.session;
  });

  return {
    // State
    currentSession,
    players,
    currentQuestionIndex,
    playerAnswers,
    chatMessages,
    isLoading,
    error,
    currentPlayer,
    
    // Getters
    isHost,
    currentQuestion,
    gameStatus,
    playerResults,
    isWebSocketConnected,
    
    // Actions
    createGameSession,
    loadGameSession,
    loadGameResults,
    connectToWebSocket,
    disconnectFromWebSocket,
    joinGameSession,
    startGame,
    submitAnswer,
    endGame,
    sendChatMessage,
    setupWebSocketListeners,
    cleanupWebSocketListeners,
    resetGameState
  };
});