<template>
    <div class="container mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold text-center mb-8">เข้าร่วมเกม</h1>
  
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
  
        <form @submit.prevent="handleJoinGame">
          <!-- Session ID -->
          <div class="mb-4">
            <label for="sessionId" class="block text-gray-700 text-sm font-bold mb-2">รหัสเกม:</label>
            <input
              id="sessionId"
              v-model="sessionId"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกรหัสเกม"
              maxlength="20"
              tabindex="1"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              ใส่รหัสเกมที่ผู้สร้างห้องแชร์ให้คุณ
            </p>
          </div>
  
          <!-- Nickname -->
          <div class="mb-6">
            <label for="nickname" class="block text-gray-700 text-sm font-bold mb-2">ชื่อเล่น:</label>
            <input
              id="nickname"
              v-model="nickname"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อเล่นของคุณ"
              maxlength="15"
              tabindex="2"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              ชื่อนี้จะแสดงให้ผู้เล่นคนอื่นเห็น (สูงสุด 15 ตัวอักษร)
            </p>
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
            :disabled="isLoading"
            tabindex="3"
          >
            <span v-if="isLoading" class="inline-block mr-2">
              <!-- Simple spinner icon -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-if="isLoading">กำลังเข้าร่วม...</span>
            <span v-else>เข้าร่วมเกม</span>
          </button>
        </form>
  
        <div class="mt-4 text-center">
          <NuxtLink to="/game/sessions" class="text-blue-500 hover:text-blue-700">
            ดูรายการเกมที่กำลังรออยู่
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useGame } from '~/composables/Game/useGame';
  
  // รับ route และ router
  const route = useRoute();
  const router = useRouter();
  
  // สถานะ
  const sessionId = ref(route.query.id?.toString() || '');
  const nickname = ref('');
  const isLoading = ref(false);
  const error = ref('');
  
  // ใช้ composable สำหรับจัดการเกม
  const { joinGame } = useGame();
  
  // เตรียมสถานะเมื่อหน้าถูกโหลด
  onMounted(() => {
    // ถ้าไม่มี session ID ให้แสดงคำแนะนำ
    if (!sessionId.value) {
      error.value = 'โปรดใส่รหัสเกมเพื่อเข้าร่วม หรือขอรหัสเกมจากผู้สร้างห้อง';
    }
  });
  
  // ฟังก์ชันเข้าร่วมเกม
  const handleJoinGame = async () => {
    if (!sessionId.value.trim() || !nickname.value.trim()) {
      error.value = 'กรุณากรอกรหัสเกมและชื่อเล่น';
      return;
    }
    
    if (nickname.value.length > 15) {
      error.value = 'ชื่อเล่นต้องไม่เกิน 15 ตัวอักษร';
      return;
    }
  
    try {
      isLoading.value = true;
      error.value = '';
  
      // เรียกใช้ฟังก์ชัน joinGame จาก composable
      await joinGame(sessionId.value.trim(), nickname.value.trim());
      
      // หมายเหตุ: เราไม่จำเป็นต้อง redirect ที่นี่เพราะ joinGame จะจัดการให้
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าร่วมเกม';
    } finally {
      isLoading.value = false;
    }
  };
  </script>