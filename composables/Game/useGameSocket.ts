import { io, Socket } from 'socket.io-client';
import { ref, onUnmounted, computed } from 'vue';
import type { SocketMessage } from '~/types/Game/game.interface';

export const useGameSocket = () => {
  // Remove /socket.io/ from the end of the URL and don't use 'ws://' protocol
  const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const lastError = ref<string | null>(null);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;

  // Computed value for UI
  const connectionStatus = computed(() => {
    if (isConnected.value) return 'connected';
    if (reconnectAttempts.value > 0) return 'reconnecting';
    return 'disconnected';
  });

  /**
   * Connect socket with better error handling
   */
  const connect = () => {
    if (!process.client) return;
    
    if (!socket.value) {
      console.log('Creating new Socket.IO connection to:', BASE_URL);
      
      // Fix socket.io configuration:
      // 1. Use polling first, then try websocket (more reliable)
      // 2. Enable upgrade to allow changing transport methods
      socket.value = io(BASE_URL, {
        autoConnect: false,
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['polling', 'websocket'], // Use polling first then websocket
        upgrade: true, // Allow transport upgrade
      });

      // Setup event listeners with better logging
      socket.value.on('connect', () => {
        isConnected.value = true;
        reconnectAttempts.value = 0;
        lastError.value = null;
        console.log('Socket connected successfully! Socket ID:', socket.value?.id);
      });

      socket.value.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        lastError.value = `Connection error: ${error.message}`;
      });

      socket.value.on('disconnect', (reason) => {
        isConnected.value = false;
        console.log('Socket disconnected. Reason:', reason);

        if (reason === 'io server disconnect' || reason === 'transport close') {
          console.log('Attempting to reconnect...');
          setTimeout(() => {
            if (!socket.value?.connected) {
              connect();
            }
          }, 1000);
        }
      });

      socket.value.on('error', (err: string) => {
        lastError.value = err;
        console.error('Socket error:', err);
      });

      socket.value.on('reconnect_attempt', (attempt) => {
        reconnectAttempts.value = attempt;
        console.log(`Reconnect attempt ${attempt}/${maxReconnectAttempts}`);
      });

      socket.value.on('reconnect_failed', () => {
        console.error('Socket reconnection failed after max attempts');
      });
    }

    if (!socket.value.connected) {
      console.log('Attempting to connect socket...');
      socket.value.connect();
    }
  };

  // Rest of the code remains the same...
  
  /**
   * Disconnect socket
   */
  const disconnect = () => {
    if (socket.value) {
      console.log('Manually disconnecting socket');
      socket.value.disconnect();
      isConnected.value = false;
    }
  };

  /**
   * Join game session with better error handling
   */
  const joinSession = (sessionId: string, userId: number, nickname: string) => {
    console.log(`Attempting to join session: ${sessionId}, user: ${userId}, nickname: ${nickname}`);
    
    if (!isConnected.value) {
      console.log('Socket not connected, connecting first...');
      connect();
    }
    
    if (socket.value && isConnected.value) {
      console.log(`Emitting join_session event for session ${sessionId}`);
      socket.value.emit('join_session', sessionId, userId, nickname);
    } else {
      console.error('Cannot join session: Socket not connected');
      // Queue join for when socket connects
      socket.value?.once('connect', () => {
        console.log(`Socket connected, now joining session ${sessionId}`);
        socket.value?.emit('join_session', sessionId, userId, nickname);
      });
    }
  };

  const startGame = (sessionId: string, hostId: number) => {
    if (!isConnected.value) {
      connect();
    }
    
    if (socket.value && isConnected.value) {
      console.log(`Emitting start_game for session ${sessionId}`);
      socket.value.emit('start_game', sessionId, hostId);
    } else {
      console.error('Cannot start game: Socket not connected');
    }
  };

  const submitAnswer = (
    sessionId: string,
    userId: number,
    questionId: number,
    choiceId: number,
    timeSpent: number
  ) => {
    if (!isConnected.value) {
      connect();
    }
    
    if (socket.value && isConnected.value) {
      socket.value.emit('submit_answer', sessionId, userId, questionId, choiceId, timeSpent);
    } else {
      console.error('Cannot submit answer: Socket not connected');
    }
  };

  const endGame = (sessionId: string, hostId: number) => {
    if (!isConnected.value) {
      connect();
    }
    
    if (socket.value && isConnected.value) {
      socket.value.emit('end_game', sessionId, hostId);
    } else {
      console.error('Cannot end game: Socket not connected');
    }
  };

  const sendChatMessage = (sessionId: string, userId: number, message: string) => {
    if (!isConnected.value) {
      connect();
    }
    
    if (socket.value && isConnected.value) {
      socket.value.emit('chat_message', sessionId, userId, message);
    } else {
      console.error('Cannot send chat message: Socket not connected');
    }
  };

  const onMessage = (callback: (message: SocketMessage) => void) => {
    if (socket.value) {
      socket.value.on('message', (messageStr: string) => {
        try {
          const message = JSON.parse(messageStr) as SocketMessage;
          callback(message);
        } catch (error) {
          console.error('Error parsing socket message:', error, messageStr);
        }
      });
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.off(event, callback);
    }
  };

  // Clean up on component unmount
  onUnmounted(() => {
    console.log('Component unmounted, disconnecting socket');
    disconnect();
  });

  return {
    socket,
    isConnected,
    lastError,
    connectionStatus,
    reconnectAttempts,
    connect,
    disconnect,
    joinSession,
    startGame,
    submitAnswer,
    endGame,
    sendChatMessage,
    onMessage,
    on,
    off
  };
}