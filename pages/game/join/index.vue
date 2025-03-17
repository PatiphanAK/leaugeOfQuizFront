<template>
  <div class="container mx-auto py-8 px-4">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div class="text-xl">กำลังโหลด...</div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
      <div class="mt-2">
        <button 
          @click="retryConnection" 
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          ลองใหม่
        </button>
      </div>
    </div>

    <div v-else-if="!session || !session.ID" class="flex flex-col items-center">
      <p class="text-red-500 mb-2">ไม่พบเกมที่คุณต้องการ</p>
      <p class="text-gray-600 mb-4">เกมอาจถูกยกเลิกหรือรหัสเกมไม่ถูกต้อง</p>
      <NuxtLink to="/game/join" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        กลับไปหน้าเข้าร่วมเกม
      </NuxtLink>
    </div>

    <div v-else class="animate-fade-in">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">ห้องรอเกม</h1>
        <div class="flex flex-col items-end">
          <p class="text-lg bg-gray-100 p-2 rounded-md inline-block">
            รหัสเกม: <span class="font-mono font-bold">{{ session.ID }}</span>
            <button @click="copySessionId" class="ml-2 p-1 hover:bg-gray-200 rounded">
              <span>📋</span>
            </button>
          </p>
          <div class="text-sm mt-2" v-if="gameSocket.isConnected">
            <span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span> เชื่อมต่อแล้ว
          </div>
          <div class="text-sm mt-2 text-red-500" v-else>
            <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span> ไม่มีการเชื่อมต่อ
            <button @click="reconnectSocket" class="underline ml-1">เชื่อมต่อใหม่</button>
          </div>
        </div>
      </div>

      <!-- ข้อมูลเกม -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold mb-2">{{ session.quiz?.title || 'กำลังโหลด...' }}</h2>
        <p class="text-gray-600 mb-4">{{ session.quiz?.description || '' }}</p>
        
        <div class="flex flex-wrap items-center gap-4">
          <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {{ getStatusText(session.status) }}
          </div>
          <div class="flex items-center">
            <span class="mr-2">ผู้เล่นเข้าร่วมแล้ว:</span>
            <span class="font-bold">{{ players.length || 0 }}</span>
            <span class="text-gray-500 text-sm ml-1">คน</span>
          </div>
          <div v-if="isHost" class="text-green-600 font-medium ml-auto">
            คุณเป็นเจ้าของห้อง
          </div>
        </div>
      </div>

      <!-- รายชื่อผู้เล่น -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">ผู้เล่นในห้อง</h3>
          <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{{ players.length }} / {{ maxPlayers }}</span>
        </div>
        
        <div v-if="players.length === 0" class="flex flex-col items-center justify-center h-40 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p>ยังไม่มีผู้เล่นเข้าร่วม</p>
          <p class="text-sm mt-1">แชร์รหัสเกมให้เพื่อนเพื่อเริ่มเล่น</p>
        </div>
        
        <ul v-else class="space-y-2 max-h-96 overflow-y-auto">
          <li v-for="player in players" :key="player.id" 
              class="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition duration-200">
            <div class="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-3 text-lg font-bold">
              {{ player.nickname.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-lg">{{ player.nickname }}</div>
              <div v-if="player.userId === session.hostId" class="text-sm text-blue-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                เจ้าของห้อง
              </div>
            </div>
            <div class="text-gray-500 text-sm">
              เข้าร่วมเมื่อ {{ formatJoinTime(player.joinedAt) }}
            </div>
          </li>
        </ul>
      </div>

      <!-- ปุ่มควบคุม -->
      <div class="flex justify-center">
        <button
          v-if="isHost && session.status === 'lobby'"
          @click="handleStartGame"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 mr-4 flex items-center"
          :disabled="isStarting || players.length < 1"
        >
          <svg v-if="isStarting" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="isStarting">กำลังเริ่มเกม...</span>
          <span v-else>เริ่มเกม{{ players.length < 1 ? ' (รอผู้เล่น)' : '' }}</span>
        </button>

        <button
          v-if="session.status === 'in_progress'"
          @click="goToPlayGame"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          เข้าสู่เกม
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useGameStore } from '~/stores/Game/useGameStore';
import { useGameSocket } from '~/composables/Game/useGameSocket';
import { useToast } from '~/composables/useToast';
import { useGame } from '~/composables/Game/useGame';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import type { GameSession, Player } from '~/types/Game/game.interface';

// รับ params และ router
const route = useRoute();
const router = useRouter();
const sessionId = route.params.id as string;
const toast = useToast();

// สถานะ
const isLoading = ref(true);
const error = ref('');
const session = ref<GameSession | null>(null);
const players = ref<Player[]>([]);
const isStarting = ref(false);
const maxPlayers = 50; // กำหนดค่าสูงสุดของผู้เล่น

// ใช้ store และ composable
const gameStore = useGameStore();
const authStore = useAuthStore();
const gameSocket = useGameSocket();
const { startGame } = useGame();

// ตรวจสอบว่าเป็นเจ้าของห้องหรือไม่
const isHost = computed(() => {
  return session.value?.hostId === (authStore.userProfile?.id || authStore.state.user?.id);
});

// แปลงสถานะให้เป็นข้อความไทย
const getStatusText = (status: string | undefined) => {
  switch (status) {
    case 'lobby': return 'รอผู้เล่น';
    case 'in_progress': return 'กำลังเล่น';
    case 'completed': return 'จบเกมแล้ว';
    default: return 'ไม่ทราบสถานะ';
  }
};

// Format join time
const formatJoinTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

// โหลดข้อมูลเกมและผู้เล่น
const loadGameSession = async () => {
  try {
    isLoading.value = true;
    
    // โหลดข้อมูล session
    const response = await gameStore.getGameSession(sessionId);
    
    if (response) {
      // แปลงคีย์ ID เป็น id ก่อนเก็บในตัวแปร
      const normalizedSession = { ...response };
      if (normalizedSession.ID) {
        normalizedSession.id = normalizedSession.ID;
      }
      
      session.value = normalizedSession;
      players.value = response.Players || [];
    } else {
      throw new Error('ไม่พบข้อมูลเกม');
    }
  } catch (err) {
    console.error('Load game session error:', err);
    error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลเกม';
  } finally {
    isLoading.value = false;
  }
};

// ฟังก์ชันเริ่มเกม
const handleStartGame = async () => {
  if (!session.value) return;
  
  try {
    isStarting.value = true;
    
    // เรียกใช้ฟังก์ชัน startGame
    await startGame(sessionId);
    
    // ไปยังหน้าเล่นเกม
    router.push(`/game/play/${sessionId}`);
  } catch (err) {
    console.error('Start game error:', err);
    toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเริ่มเกม');
  } finally {
    isStarting.value = false;
  }
};

// ฟังก์ชันไปยังหน้าเล่นเกม
const goToPlayGame = () => {
  router.push(`/game/play/${sessionId}`);
};

// ฟังก์ชันคัดลอกรหัสเกม
const copySessionId = () => {
  if (!session.value?.id) return;
  
  navigator.clipboard.writeText(session.value.id)
    .then(() => toast.success('คัดลอกรหัสเกมเรียบร้อย'))
    .catch(() => toast.error('ไม่สามารถคัดลอกรหัสเกม'));
};

// เชื่อมต่อ WebSocket ใหม่
const reconnectSocket = () => {
  gameSocket.disconnect();
  setupSocket();
};

// ลองเชื่อมต่อและโหลดข้อมูลใหม่
const retryConnection = async () => {
  error.value = '';
  isLoading.value = true;
  
  try {
    await loadGameSession();
    setupSocket();
  } catch (err) {
    error.value = 'ไม่สามารถเชื่อมต่อได้ โปรดลองอีกครั้ง';
  } finally {
    isLoading.value = false;
  }
};

// Improved socket setup function
const setupSocket = () => {
  // Connect socket
  console.log('Setting up WebSocket connection...');
  gameSocket.connect();
  
  // Wait a bit for connection to initialize
  setTimeout(() => {
    const currentUser = authStore.userProfile || authStore.state.user;
    if (currentUser && currentUser.id) {
      console.log('User found:', currentUser.id);
      
      // Use nickname from user or player record
      const player = players.value.find(p => p.userId === currentUser.id);
      const nickname = player?.nickname || currentUser.username || currentUser.displayName || 'Guest';
      
      console.log(`Joining session as ${nickname}`);
      gameSocket.joinSession(sessionId, currentUser.id, nickname);
    } else {
      console.error('No user data available');
    }
  }, 500);
  
  // Listen for player_joined event
  gameSocket.on('player_joined', (payload: any) => {
    console.log('Received player_joined event:', payload);
    if (payload.sessionId === sessionId && payload.player) {
      // Check if player already exists
      const playerExists = players.value.some(p => p.id === payload.player.id);
      
      if (!playerExists) {
        players.value.push(payload.player);
        toast.success(`${payload.player.nickname} เข้าร่วมเกม`);
      }
    }
  });
  
  // Listen for game_started event
  gameSocket.on('game_started', (payload: any) => {
    console.log('Received game_started event:', payload);
    if (payload.sessionId === sessionId) {
      session.value = { ...session.value, status: 'in_progress' } as GameSession;
      toast.success('เกมเริ่มแล้ว!');
      router.push(`/game/play/${sessionId}`);
    }
  });
  
  // Listen for direct message events from server
  gameSocket.on('message', (messageStr: string) => {
    console.log('Received raw message event:', messageStr);
    try {
      const message = JSON.parse(messageStr);
      console.log('Parsed message:', message);
      
      // Handle different message types
      if (message.type === 'player_joined' && message.payload?.sessionId === sessionId) {
        const newPlayer = message.payload.player;
        if (newPlayer && !players.value.some(p => p.id === newPlayer.id)) {
          players.value.push(newPlayer);
          toast.success(`${newPlayer.nickname} เข้าร่วมเกม`);
        }
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  });
  
  // Listen for socket connection/disconnection events
  gameSocket.on('connect', () => {
    console.log('Socket connected with ID:', gameSocket.socket?.value?.id);
  });
  
  gameSocket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  
  // Listen for server errors
  gameSocket.on('error', (errorMsg: string) => {
    console.error('Server error:', errorMsg);
    toast.error(`Server error: ${errorMsg}`);
  });
};

// watch for changes in players to automatically scroll the list
watch(players, () => {
  // Could add a scroll to bottom function here if needed
}, { deep: true });

// lifecycle hooks
onMounted(async () => {
  await loadGameSession();
  setupSocket();
});

onUnmounted(() => {
  // ยกเลิกการเชื่อมต่อ socket เมื่อออกจากหน้า
  gameSocket.disconnect();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>