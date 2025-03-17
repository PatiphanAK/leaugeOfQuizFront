<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p class="font-bold">ข้อผิดพลาด</p>
        <p>{{ error }}</p>
        <button @click="router.back()" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          กลับ
        </button>
      </div>
  
      <!-- Game Session -->
      <div v-else>
        <!-- Lobby State (รอผู้เล่น) -->
        <template v-if="gameStatus === 'lobby'">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold mb-4">{{ currentSession?.Quiz?.Title || 'ห้องเกม' }}</h1>
            
            <div class="mb-6">
              <p class="text-gray-600 dark:text-gray-300 mb-2">รหัสห้อง: <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ activeSessionId }}</span></p>
              <p class="text-gray-600 dark:text-gray-300">สถานะ: รอผู้เล่นเข้าร่วม</p>
            </div>
  
            <!-- ส่วนข้อมูลห้อง ถ้าเป็นโฮสต์ -->
            <div v-if="isHost" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <h2 class="text-lg font-semibold mb-2">คุณเป็นเจ้าของห้องนี้</h2>
              <p class="mb-4">เมื่อผู้เล่นพร้อมแล้ว คุณสามารถเริ่มเกมได้</p>
              <button 
                @click="start" 
                :disabled="!canStartGame"
                class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                เริ่มเกม
              </button>
            </div>
  
            <!-- ส่วนข้อมูลห้อง ถ้าเป็นผู้เล่น -->
            <div v-else class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <h2 class="text-lg font-semibold mb-2">คุณเข้าร่วมห้องนี้แล้ว</h2>
              <p>รอเจ้าของห้องเริ่มเกม</p>
            </div>
            
            <!-- รายชื่อผู้เล่น -->
            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-3">ผู้เล่น ({{ players.length }})</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  v-for="player in players" 
                  :key="player.ID"
                  class="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 dark:text-blue-300 font-semibold">{{ player.Nickname.substring(0, 2).toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="font-medium">{{ player.Nickname }}</p>
                    <p v-if="currentSession?.Host?.ID === player.UserID" class="text-xs text-blue-600 dark:text-blue-400">เจ้าของห้อง</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- แชท -->
            <div class="border dark:border-gray-700 rounded-lg">
              <h3 class="text-lg font-semibold px-4 py-2 border-b dark:border-gray-700">แชทห้อง</h3>
              
              <div class="h-60 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                <div v-if="chatMessages.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
                  ยังไม่มีข้อความ
                </div>
                
                <div 
                  v-for="(message, index) in chatMessages" 
                  :key="index"
                  class="mb-3"
                >
                  <p class="text-xs text-gray-500">{{ message.nickname }} • {{ new Date(message.timestamp).toLocaleTimeString() }}</p>
                  <p class="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">{{ message.message }}</p>
                </div>
              </div>
              
              <div class="p-4 border-t dark:border-gray-700">
                <div class="flex">
                  <input 
                    v-model="chatMessage" 
                    @keyup.enter="sendChat"
                    type="text" 
                    placeholder="พิมพ์ข้อความ..." 
                    class="flex-grow px-3 py-2 border dark:border-gray-700 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  >
                  <button 
                    @click="sendChat"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                  >
                    ส่ง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
  
        <!-- In Game State (กำลังเล่นเกม) -->
        <template v-else-if="gameStatus === 'in_progress'">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold">{{ currentSession?.Quiz?.Title }}</h1>
              <div class="text-lg font-mono bg-blue-500 text-white px-3 py-1 rounded-full">
                เวลา: {{ Math.ceil(timeLeft) }} วินาที
              </div>
            </div>
  
            <!-- คำถามปัจจุบัน -->
            <div v-if="currentQuestion" class="mb-8">
              <h2 class="text-xl font-semibold mb-4">คำถามที่ {{ (currentQuestionIndex || 0) + 1 }}</h2>
              
              <!-- รูปภาพคำถาม (ถ้ามี) -->
              <img 
                v-if="currentQuestion.imageURL" 
                :src="currentQuestion.imageURL" 
                alt="Question Image"
                class="mb-4 max-w-full h-auto rounded"
              >
              
              <p class="text-lg mb-6">{{ currentQuestion.text }}</p>
              
              <!-- ตัวเลือกคำตอบ -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  v-for="choice in currentQuestion.choices"
                  :key="choice.id"
                  @click="() => selectedChoiceId = choice.id"
                  :class="[
                    'p-4 rounded-lg border text-left transition-all',
                    selectedChoiceId === choice.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  ]"
                >
                  <div class="flex items-start space-x-2">
                    <div class="flex-shrink-0 mt-1">
                      <div 
                        :class="[
                          'w-5 h-5 rounded-full border flex items-center justify-center',
                          selectedChoiceId === choice.id
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        ]"
                      >
                        <svg v-if="selectedChoiceId === choice.id" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <!-- รูปภาพตัวเลือก (ถ้ามี) -->
                      <img 
                        v-if="choice.imageURL" 
                        :src="choice.imageURL" 
                        alt="Choice Image"
                        class="mb-2 max-w-full h-auto rounded"
                      >
                      <p>{{ choice.text }}</p>
                    </div>
                  </div>
                </button>
              </div>
              
              <!-- ปุ่มยืนยันคำตอบ -->
              <div class="mt-6 text-center">
                <button 
                  @click="submitAnswer"
                  :disabled="!selectedChoiceId || isAnswerSubmitted"
                  class="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isAnswerSubmitted ? 'ส่งคำตอบแล้ว' : 'ส่งคำตอบ' }}
                </button>
              </div>
            </div>
  
            <!-- ผู้เล่นทั้งหมด - แสดงคะแนนระหว่างเกม -->
            <div>
              <h3 class="text-lg font-semibold mb-3">คะแนน</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div 
                  v-for="player in players" 
                  :key="player.ID"
                  class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span>{{ player.Nickname }}</span>
                  <span class="font-bold">{{ player.Score }}</span>
                </div>
              </div>
            </div>
  
            <!-- ปุ่มยกเลิกเกม (สำหรับเจ้าของห้องเท่านั้น) -->
            <div v-if="isHost" class="mt-8 text-center">
              <button 
                @click="endGame"
                class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                จบเกม
              </button>
            </div>
          </div>
        </template>
  
        <!-- Game Ended State (เกมจบแล้ว) -->
        <template v-else-if="gameStatus === 'ended'">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-center mb-8">ผลการแข่งขัน: {{ currentSession?.Quiz?.Title }}</h1>
            
            <!-- อันดับผู้เล่น -->
            <div class="max-w-2xl mx-auto mb-10">
              <h2 class="text-xl font-semibold mb-4 text-center">อันดับผู้เล่น</h2>
              
              <div class="space-y-4">
                <!-- อันดับที่ 1 -->
                <div 
                  v-if="playerResults[0]"
                  class="flex items-center bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg shadow"
                >
                  <div class="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <div class="ml-4 flex-grow">
                    <p class="font-bold text-lg">{{ playerResults[0].nickname }}</p>
                  </div>
                  <div class="text-2xl font-bold">{{ playerResults[0].score }}</div>
                </div>
                
                <!-- อันดับที่ 2 -->
                <div 
                  v-if="playerResults[1]"
                  class="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div class="ml-4 flex-grow">
                    <p class="font-bold">{{ playerResults[1].nickname }}</p>
                  </div>
                  <div class="text-xl font-bold">{{ playerResults[1].score }}</div>
                </div>
                
                <!-- อันดับที่ 3 -->
                <div 
                  v-if="playerResults[2]"
                  class="flex items-center bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg shadow"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-yellow-700 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div class="ml-4 flex-grow">
                    <p class="font-bold">{{ playerResults[2].nickname }}</p>
                  </div>
                  <div class="text-xl font-bold">{{ playerResults[2].score }}</div>
                </div>
                
                <!-- อันดับถัดไป -->
                <div 
                  v-for="(player, index) in playerResults.slice(3)"
                  :key="player.id"
                  class="flex items-center bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700"
                >
                  <div class="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center font-medium text-gray-600 dark:text-gray-300">
                    {{ index + 4 }}
                  </div>
                  <div class="ml-3 flex-grow">
                    <p>{{ player.nickname }}</p>
                  </div>
                  <div class="font-bold">{{ player.score }}</div>
                </div>
              </div>
            </div>
            
            <!-- ปุ่มกลับหน้าหลัก -->
            <div class="text-center">
              <button 
                @click="leaveGame"
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold"
              >
                กลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        </template>
  
        <!-- Unknown State -->
        <template v-else>
          <div class="text-center p-10">
            <p class="text-xl">สถานะไม่ถูกต้อง</p>
            <button @click="router.back()" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              กลับ
            </button>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import useGameSession from '~/composables/Game/useGameSession';
  
  const route = useRoute();
  const router = useRouter();
  const sessionId = route.params.id as string;
  
  // ใช้ composable ที่เราสร้างไว้เพื่อจัดการเกม
  const {
    // State
    activeSessionId,
    nickname,
    selectedChoiceId,
    isAnswerSubmitted,
    chatMessage,
    
    // Store refs
    currentSession,
    players,
    currentPlayer,
    currentQuestion,
    isHost,
    gameStatus,
    isLoading,
    error,
    isWebSocketConnected,
    chatMessages,
    timeLeft,
    
    // Computed
    canStartGame,
    playerResults,
    
    // Methods
    initializeSession,
    joinSession,
    start,
    submitAnswer,
    endGame,
    sendChat,
    leaveGame
  } = useGameSession(sessionId);
  
  // ติดตามเวลาที่เหลือและส่งคำตอบอัตโนมัติเมื่อหมดเวลา
  watch(timeLeft, (newTime) => {
    if (newTime <= 0 && !isAnswerSubmitted.value && currentQuestion.value) {
      // ถ้าผู้เล่นยังไม่ได้เลือกคำตอบ ให้สุ่มเลือก
      if (!selectedChoiceId.value && currentQuestion.value.choices && currentQuestion.value.choices.length > 0) {
        // สุ่มเลือกคำตอบ
        const randomIndex = Math.floor(Math.random() * currentQuestion.value.choices.length);
        selectedChoiceId.value = currentQuestion.value.choices[randomIndex].id;
      }
      
      // ส่งคำตอบอัตโนมัติ
      submitAnswer();
    }
  });
  
  // เริ่มต้นเชื่อมต่อและโหลดข้อมูลเกมเมื่อ component ถูกโหลด
  onMounted(async () => {
    await initializeSession();
    // ถ้าเป็นผู้เล่น (ไม่ใช่เจ้าของห้อง) และยังไม่ได้เข้าร่วม ให้เข้าร่วมเกมอัตโนมัติ
    if (!isHost.value && !currentPlayer.value) {
      joinSession();
    }
  });
  
  // ทำความสะอาดเมื่อออกจากหน้า
  onUnmounted(() => {
    // เราไม่ต้องตัด WebSocket connection ทันทีเมื่อออกจากหน้า
    // เพราะอาจจะนำทางไปยังหน้าผลลัพธ์
    // การตัดการเชื่อมต่อจะเกิดขึ้นเมื่อกดปุ่ม "กลับสู่หน้าหลัก" เท่านั้น
  });
  </script>