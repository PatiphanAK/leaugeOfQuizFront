// composables/useGameSession.ts

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '~/stores/Game/useGameStore';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import { storeToRefs } from 'pinia';

export default function useGameSession(sessionId?: string) {
  const gameStore = useGameStore();
  const authStore = useAuthStore();
  const router = useRouter();

  // Destructure what we need from the stores with storeToRefs to maintain reactivity
  const { 
    currentSession, 
    players, 
    currentQuestion, 
    currentQuestionIndex,
    isHost, 
    gameStatus, 
    isLoading, 
    error, 
    isWebSocketConnected,
    currentPlayer,
    chatMessages
  } = storeToRefs(gameStore);

  // เข้าถึง user จาก state หรือ userProfile ตามโครงสร้างจริงของ authStore
  const { state, userProfile } = storeToRefs(authStore);
  // คุณสามารถใช้ userProfile โดยตรง หรือเข้าถึง state.user
  const user = userProfile; // หรือ computed(() => state.value.user);

  // Local state
  const nickname = ref(user.value?.displayName || '');
  const activeSessionId = ref(sessionId || '');
  const selectedQuizId = ref<number | null>(null);
  const selectedChoiceId = ref<number | null>(null);
  const answerTimeStart = ref<number | null>(null);
  const isAnswerSubmitted = ref(false);
  const chatMessage = ref('');

  // Computed properties
  const canStartGame = computed(() => {
    return isHost.value && gameStatus.value === 'lobby' && players.value.length > 0;
  });

  const canAnswer = computed(() => {
    return gameStatus.value === 'in_progress' && 
           currentQuestion.value !== null && 
           !isAnswerSubmitted.value;
  });

  const timeLeft = computed(() => {
    if (!currentSession.value?.quiz?.timeLimit || !answerTimeStart.value) {
      return 0;
    }
    const elapsed = (Date.now() - answerTimeStart.value) / 1000;
    const timeLimit = currentSession.value.quiz.timeLimit;
    return Math.max(0, timeLimit - elapsed);
  });

  // Methods
  async function initializeSession() {
    if (!activeSessionId.value) return;

    try {
      // Ensure WebSocket connection
      if (!isWebSocketConnected.value) {
        await gameStore.connectToWebSocket();
        gameStore.setupWebSocketListeners();
      }

      // Load session details via REST API
      await gameStore.loadGameSession(activeSessionId.value);
    } catch (error) {
      console.error('Failed to initialize game session:', error);
    }
  }

  async function createSession() {
    if (!selectedQuizId.value) {
      return false;
    }

    try {
      // Ensure WebSocket connection
      if (!isWebSocketConnected.value) {
        await gameStore.connectToWebSocket();
        gameStore.setupWebSocketListeners();
      }

      // Create new session
      const session = await gameStore.createGameSession(selectedQuizId.value);
      activeSessionId.value = session.id;

      // Join as host
      if (user.value) {
        gameStore.joinGameSession(
          session.id,
          user.value.id,
          nickname.value || user.value.displayName || user.value.username
        );
      }

      return true;
    } catch (error) {
      console.error('Failed to create game session:', error);
      return false;
    }
  }

  function joinSession() {
    if (!activeSessionId.value || !user.value) {
      return false;
    }

    return gameStore.joinGameSession(
      activeSessionId.value,
      user.value.id,
      nickname.value || user.value.displayName || user.value.username
    );
  }

  function start() {
    if (!activeSessionId.value || !user.value || !isHost.value) {
      return false;
    }

    return gameStore.startGame(activeSessionId.value, user.value.id);
  }

  function submitAnswer() {
    if (!activeSessionId.value || !user.value || !currentQuestion.value || !selectedChoiceId.value || !answerTimeStart.value) {
      return false;
    }

    const timeSpent = (Date.now() - answerTimeStart.value) / 1000;
    isAnswerSubmitted.value = true;

    return gameStore.submitAnswer(
      activeSessionId.value,
      user.value.id,
      currentQuestion.value.id,
      selectedChoiceId.value,
      timeSpent
    );
  }

  function endGame() {
    if (!activeSessionId.value || !user.value || !isHost.value) {
      return false;
    }

    return gameStore.endGame(activeSessionId.value, user.value.id);
  }

  function sendChat() {
    if (!activeSessionId.value || !user.value || !chatMessage.value) {
      return false;
    }

    const result = gameStore.sendChatMessage(
      activeSessionId.value,
      user.value.id,
      chatMessage.value
    );

    if (result) {
      chatMessage.value = '';
    }

    return result;
  }

  function leaveGame() {
    gameStore.disconnectFromWebSocket();
    gameStore.resetGameState();
    router.push('/'); // Or wherever you want to redirect
  }

  // Question timer and handlers
  watch(currentQuestionIndex, () => {
    if (currentQuestionIndex.value !== null) {
      answerTimeStart.value = Date.now();
      isAnswerSubmitted.value = false;
      selectedChoiceId.value = null;
    }
  });

  watch(gameStatus, (newStatus) => {
    if (newStatus === 'ended') {
      // Maybe navigate to results page or show results overlay
      router.push(`/games/results/${activeSessionId.value}`);
    }
  });

  // Lifecycle hooks
  onMounted(async () => {
    if (activeSessionId.value) {
      await initializeSession();
    }
  });

  onUnmounted(() => {
    gameStore.cleanupWebSocketListeners();
  });

  return {
    // State refs
    nickname,
    activeSessionId,
    selectedQuizId,
    selectedChoiceId,
    answerTimeStart,
    isAnswerSubmitted,
    chatMessage,

    // Store refs
    currentSession,
    players,
    currentQuestion,
    isHost,
    gameStatus,
    isLoading,
    error,
    isWebSocketConnected,
    currentPlayer,
    chatMessages,
    timeLeft,
    user,

    // Computed
    canStartGame,
    canAnswer,

    // Methods
    initializeSession,
    createSession,
    joinSession,
    start,
    submitAnswer,
    endGame,
    sendChat,
    leaveGame
  };
}