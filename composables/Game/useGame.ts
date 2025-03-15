import { useGameStore } from '~/stores/Game/useGameStore';
import { useGameSocket } from '~/composables/Game/useGameSocket';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import { useToast } from '../useToast';
import type { GameSession, Player, Question, ChatMessage } from '~/types/Game/game.interface';

export const useGame = () => {
  const gameStore = useGameStore();
  const socketService = useGameSocket();
  const authStore = useAuthStore();
  
  const router = useRouter();
  const toast = useToast?.() || { 
    // ถ้าไม่มี toast plugin ให้ใช้ console แทน
    success: (msg: string) => console.log(msg),
    error: (msg: string) => console.error(msg)
  };

  /**
   * เริ่มต้นเกม: โหลดข้อมูลเกม, เชื่อมต่อ socket, ฯลฯ
   */
  const initGame = async (sessionId: string) => {
    try {
      // 1. โหลดข้อมูลเกม
      await gameStore.getGameSession(sessionId);
      
      // 2. เชื่อมต่อ WebSocket
      socketService.connect();
      
      // 3. ลงทะเบียนรับข้อมูลจาก WebSocket
      registerSocketEvents();
      
      // 4. เข้าร่วมห้อง (หรือถ้าเป็นโฮสต์ ก็จะเป็นการเชื่อมต่อกับห้องที่มีอยู่แล้ว)
      const nickname = authStore.user?.displayName || 'Player';
      socketService.joinSession(sessionId, authStore.user?.id || 0, nickname);
      
      return gameStore.currentSession;
    } catch (error: any) {
      toast.error('ไม่สามารถเชื่อมต่อกับเกมได้: ' + (error.message || 'เกิดข้อผิดพลาด'));
      throw error;
    }
  };

  /**
   * ลงทะเบียนรับ events จาก socket
   */
  const registerSocketEvents = () => {
    // รับข้อความทั่วไปจาก socket
    socketService.onMessage(handleSocketMessage);
    
    // รับการยืนยันการเข้าร่วม
    socketService.on('joined', handleJoined);
    
    // รับการยืนยันการส่งคำตอบ
    socketService.on('answer_submitted', handleAnswerSubmitted);
    
    // รับข้อผิดพลาด
    socketService.on('error', handleError);
  };

  /**
   * จัดการข้อความจาก WebSocket
   */
  const handleSocketMessage = (message: any) => {
    try {
      switch (message.type) {
        case 'player_joined':
          handlePlayerJoined(message.payload);
          break;
        
        case 'game_started':
          handleGameStarted(message.payload);
          break;
        
        case 'question_started':
          handleQuestionStarted(message.payload);
          break;
        
        case 'answer_submitted':
          handleAnswerSubmitted(message.payload);
          break;
        
        case 'question_ended':
          handleQuestionEnded(message.payload);
          break;
        
        case 'game_ended':
          handleGameEnded(message.payload);
          break;
        
        case 'chat_message':
          handleChatMessage(message.payload);
          break;
      }
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  };

  /**
   * จัดการเหตุการณ์ต่างๆ
   */
  const handleJoined = (player: Player) => {
    console.log('Successfully joined the game session', player);
  };
  
  const handlePlayerJoined = (payload: { session: GameSession, player: Player }) => {
    gameStore.updateSession(payload.session);
    gameStore.addPlayer(payload.player);
    toast.success(`${payload.player.nickname} เข้าร่วมเกม`);
  };
  
  const handleGameStarted = (payload: { session: GameSession }) => {
    gameStore.updateSession(payload.session);
    toast.success('เกมได้เริ่มต้นแล้ว!');
  };
  
  const handleQuestionStarted = (payload: { question: Question, timeLimit: number }) => {
    gameStore.startQuestion(payload.question, payload.timeLimit);
  };
  
  const handleAnswerSubmitted = (payload: any) => {
    // payload จะมีเฉพาะ playerID และ questionID (ไม่มีคำตอบที่แท้จริงเพื่อป้องกันการโกง)
    // ถ้าเป็นตัวเราเอง คำตอบจะถูกส่งไปผ่าน REST API แล้ว
  };
  
  const handleQuestionEnded = (payload: any) => {
    gameStore.endQuestion();
  };
  
  const handleGameEnded = (payload: { session: GameSession, players: Player[] }) => {
    gameStore.updateSession(payload.session);
    gameStore.updatePlayers(payload.players);
    toast.success('เกมจบแล้ว!');
    
    // นำทางไปยังหน้าผลลัพธ์เกม
    router.push(`/game/${gameStore.currentSession?.id}/results`);
  };
  
  const handleChatMessage = (payload: ChatMessage) => {
    gameStore.addChatMessage(payload);
  };
  
  const handleError = (error: string) => {
    toast.error(error);
  };

  /**
   * ฟังก์ชันควบคุมเกม
   */
  const createGame = async (quizId: number) => {
    try {
      const session = await gameStore.createGameSession(quizId);
      router.push(`/game/${session.id}`);
      return session;
    } catch (error: any) {
      toast.error('ไม่สามารถสร้างเกมได้: ' + (error.message || 'เกิดข้อผิดพลาด'));
      throw error;
    }
  };
  
  const joinGame = async (sessionId: string, nickname: string) => {
    try {
      const player = await gameStore.joinGameSession(sessionId, nickname);
      router.push(`/game/${sessionId}`);
      return player;
    } catch (error: any) {
      toast.error('ไม่สามารถเข้าร่วมเกมได้: ' + (error.message || 'เกิดข้อผิดพลาด'));
      throw error;
    }
  };
  
  const startGame = async (sessionId: string) => {
    try {
      // ส่งคำขอผ่าน REST API
      await gameStore.startGameSession(sessionId);
      
      // ส่งคำขอผ่าน WebSocket เพื่อให้ทุกคนได้รับการอัพเดท
      socketService.startGame(sessionId, authStore.user?.id || 0);
    } catch (error: any) {
      toast.error('ไม่สามารถเริ่มเกมได้: ' + (error.message || 'เกิดข้อผิดพลาด'));
      throw error;
    }
  };
  
  const endGame = async (sessionId: string) => {
    try {
      // ส่งคำขอผ่าน REST API
      await gameStore.endGameSession(sessionId);
      
      // ส่งคำขอผ่าน WebSocket เพื่อให้ทุกคนได้รับการอัพเดท
      socketService.endGame(sessionId, authStore.user?.id || 0);
    } catch (error: any) {
      toast.error('ไม่สามารถจบเกมได้: ' + (error.message || 'เกิดข้อผิดพลาด'));
      throw error;
    }
  };
  
  const submitAnswer = async (questionId: number, choiceId: number) => {
    if (!gameStore.currentSession || !gameStore.currentQuestion) return;
    
    const sessionId = gameStore.currentSession.id;
    const timeSpent = gameStore.questionStartTime 
      ? (Date.now() - gameStore.questionStartTime) / 1000 
      : 0;
    
    try {
      // ส่งคำขอผ่าน REST API
      await gameStore.submitAnswer(sessionId, questionId, choiceId, timeSpent);
      
      // ส่งคำขอผ่าน WebSocket เพื่อให้ทุกคนได้รับการอัพเดท (โดยไม่เปิดเผยคำตอบที่แท้จริง)
      socketService.submitAnswer(
        sessionId, 
        authStore.user?.id || 0, 
        questionId, 
        choiceId, 
        timeSpent
      );
    } catch (error: any) {
      toast.error('ไม่สามารถส่งคำตอบได้: ' + (error.message || 'เกิดข้อผิดพลาด'));
      throw error;
    }
  };
  
  const sendChatMessage = (message: string) => {
    if (!gameStore.currentSession) return;
    
    socketService.sendChatMessage(
      gameStore.currentSession.id,
      authStore.user?.id || 0,
      message
    );
  };
  
  const leaveGame = () => {
    socketService.disconnect();
    gameStore.reset();
    router.push('/games');
  };

  /**
   * ฟังก์ชันช่วยเหลือ
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'lobby': return 'รอผู้เล่น';
      case 'in_progress': return 'กำลังเล่น';
      case 'completed': return 'จบเกมแล้ว';
      default: return status;
    }
  };
  
  const getPlayerName = (userId: number) => {
    const player = gameStore.players.find(p => p.userId === userId);
    return player ? player.nickname : 'ผู้เล่น';
  };

  // สิ่งที่ส่งกลับจาก composable
  return {
    // สถานะ (มาจาก store)
    session: computed(() => gameStore.currentSession),
    players: computed(() => gameStore.players),
    currentQuestion: computed(() => gameStore.currentQuestion),
    remainingTime: computed(() => gameStore.remainingTime),
    hasAnswered: computed(() => gameStore.hasAnswered),
    isHost: computed(() => gameStore.isHost),
    chatMessages: computed(() => gameStore.chatMessages),
    
    // การตั้งค่าและควบคุมเกม
    initGame,
    createGame,
    joinGame,
    startGame,
    endGame,
    submitAnswer,
    sendChatMessage,
    leaveGame,
    
    // ฟังก์ชันช่วยเหลือ
    getStatusText,
    getPlayerName
  };
};