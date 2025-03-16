import { io, Socket } from 'socket.io-client';
import { ref, onUnmounted, computed } from 'vue';
import type { SocketMessage } from '~/types/Game/game.interface';

export const useGameSocket = () => {
  const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const lastError = ref<string | null>(null);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;

  // คอมพิวต์ค่าเพื่อใช้ใน template
  const connectionStatus = computed(() => {
    if (isConnected.value) return 'connected';
    if (reconnectAttempts.value > 0) return 'reconnecting';
    return 'disconnected';
  });

  /**
   * เชื่อมต่อ socket
   */
  const connect = () => {
    if (!process.client) return;
    
    if (!socket.value) {
      // สร้าง socket ใหม่
      socket.value = io(BASE_URL, {
        autoConnect: false,
        withCredentials: true, // สำคัญสำหรับการส่ง cookies
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      // ตั้งค่า event listeners
      socket.value.on('connect', () => {
        isConnected.value = true;
        reconnectAttempts.value = 0;
        lastError.value = null;
        console.log('Socket connected:', socket.value?.id);
      });

      socket.value.on('disconnect', (reason) => {
        isConnected.value = false;
        console.log('Socket disconnected:', reason);

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
      socket.value.connect();
    }
  };

  /**
   * ยกเลิกการเชื่อมต่อ
   */
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      isConnected.value = false;
    }
  };

  /**
   * เข้าร่วม game session
   */
  const joinSession = (sessionId: string, userId: number, nickname: string) => {
    console.log(`Attempting to join session: ${sessionId}, user: ${userId}, nickname: ${nickname}`);
    if (!isConnected.value) {
      connect();
    }
    
    if (socket.value && isConnected.value) {
      console.log(`Joining session ${sessionId} as ${nickname} (${userId})`);
      socket.value.emit('join_session', sessionId, userId, nickname);
    } else {
      console.error('Cannot join session: Socket not connected');
      // เก็บข้อมูลไว้ให้เชื่อมต่ออีกครั้งเมื่อ socket เชื่อมต่อสำเร็จ
      socket.value?.once('connect', () => {
        console.log(`Connected, now joining session ${sessionId}`);
        socket.value?.emit('join_session', sessionId, userId, nickname);
      });
    }
  };

  /**
   * เริ่ม game
   */
  const startGame = (sessionId: string, hostId: number) => {
    if (!isConnected.value) {
      connect();
    }
    
    if (socket.value && isConnected.value) {
      socket.value.emit('start_game', sessionId, hostId);
    } else {
      console.error('Cannot start game: Socket not connected');
    }
  };

  /**
   * ส่งคำตอบ
   */
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

  /**
   * จบเกม
   */
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

  /**
   * ส่งข้อความแชท
   */
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

  /**
   * รับข้อความจาก socket
   */
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

  /**
   * รับ event โดยตรง
   */
  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.on(event, callback);
    }
  };

  /**
   * ยกเลิก event listener
   */
  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socket.value) {
      socket.value.off(event, callback);
    }
  };

  // ยกเลิกการเชื่อมต่อเมื่อ component ถูกทำลาย
  onUnmounted(() => {
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
};