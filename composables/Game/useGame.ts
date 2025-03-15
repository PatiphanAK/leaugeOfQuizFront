import { useGameStore } from '~/stores/Game/useGameStore';
import { useToast } from '~/composables/useToast';

export const useGame = () => {
  const gameStore = useGameStore();
  const toast = useToast();
  const router = useRouter();
  
  /**
   * สร้างเกมใหม่จาก quiz ID
   */
  const createGame = async (quizId: number) => {
    try {
      const session = await gameStore.createGameSession(quizId);
      
      if (session && session.ID) {
        // Navigate to the game session page
        await router.push(`/game/session/${session.ID}`);
        toast.success('สร้างเกมสำเร็จ');
        return session;
      } else {
        throw new Error('ไม่ได้รับข้อมูล session ที่ถูกต้อง');
      }
    } catch (error) {
      console.error('Create game error:', error);
      const errorMessage = (error as Error).message || 'เกิดข้อผิดพลาด';
      toast.error(`ไม่สามารถสร้างเกมได้: ${errorMessage}`);
      throw error;
    }
  };
  
  /**
   * เข้าร่วมเกมด้วย session ID และชื่อผู้เล่น
   */
  const joinGame = async (sessionId: string, nickname: string) => {
    try {
      const player = await gameStore.joinGameSession(sessionId, nickname);
      
      if (player) {
        // หลังจากเข้าร่วมสำเร็จ นำทางไปยังหน้าเกม
        await router.push(`/game/play/${sessionId}`);
        toast.success('เข้าร่วมเกมสำเร็จ');
        return player;
      } else {
        throw new Error('ไม่ได้รับข้อมูลผู้เล่นที่ถูกต้อง');
      }
    } catch (error) {
      console.error('Join game error:', error);
      const errorMessage = (error as Error).message || 'เกิดข้อผิดพลาด';
      toast.error(`ไม่สามารถเข้าร่วมเกม: ${errorMessage}`);
      throw error;
    }
  };
  
  /**
   * เริ่มเกมด้วย session ID
   */
  const startGame = async (sessionId: string) => {
    try {
      const session = await gameStore.startGameSession(sessionId);
      
      if (session) {
        toast.success('เริ่มเกมสำเร็จ');
        return session;
      } else {
        throw new Error('ไม่ได้รับข้อมูล session ที่ถูกต้อง');
      }
    } catch (error) {
      console.error('Start game error:', error);
      const errorMessage = (error as Error).message || 'เกิดข้อผิดพลาด';
      toast.error(`ไม่สามารถเริ่มเกม: ${errorMessage}`);
      throw error;
    }
  };
  
  return {
    createGame,
    joinGame,
    startGame,
    // Return more methods as needed
  };
};