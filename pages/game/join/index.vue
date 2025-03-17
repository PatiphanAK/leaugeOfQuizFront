<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const roomCode = ref('');
const isJoining = ref(false);
const error = ref('');
const successMessage = ref('');

const joinRoom = async () => {
  if (!roomCode.value) {
    error.value = 'กรุณากรอกรหัสห้อง';
    return;
  }
  
  try {
    isJoining.value = true;
    error.value = '';
    
    // เชื่อมต่อกับ API เพื่อเข้าร่วมห้อง
    // ตัวอย่างเช่น:
    // const response = await $fetch('/api/rooms/join', {
    //   method: 'POST',
    //   body: { code: roomCode.value }
    // });
    
    // จำลองการรอการตอบกลับ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    successMessage.value = 'เข้าร่วมห้องสำเร็จ! กำลังนำคุณไปยังห้องทดสอบ...';
    
    // รอสักครู่แล้วนำทางไปยังห้องทดสอบ
    setTimeout(() => {
      navigateTo(`/game/sessions/${roomCode.value}`);
    }, 1500);
    
  } catch (err) {
    console.error('Failed to join room:', err);
    error.value = 'ไม่พบรหัสห้องนี้ หรือคุณไม่มีสิทธิ์เข้าถึง';
  } finally {
    isJoining.value = false;
  }
};

// เตรียมฟังก์ชันรับรหัสห้องจาก URL parameters (ถ้ามี)
onMounted(() => {
  const route = useRoute();
  if (route.query.code) {
    roomCode.value = route.query.code as string;
  }
});

definePageMeta({
  layout: 'dashboard-layout',
  title: 'เข้าร่วมห้องทดสอบ',
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- หัวข้อหลัก -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">เข้าร่วมห้อง</h1>
        <p class="text-gray-600 dark:text-gray-300">เข้าร่วมห้องทดสอบเพื่อทำแบบทดสอบที่เตรียมไว้ให้คุณ</p>
      </div>
      
      <!-- การ์ดหลัก -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
        <!-- ข้อความแจ้งเตือนความสำเร็จ -->
        <div v-if="successMessage" class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>
        
        <!-- ข้อความแจ้งเตือนข้อผิดพลาด -->
        <div v-if="error" class="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>
        
        <!-- ฟอร์มกรอกรหัสห้อง -->
        <div class="mb-6">
          <label for="room-code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รหัสห้อง</label>
          <div class="flex">
            <input 
              type="text" 
              id="room-code" 
              v-model="roomCode"
              class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="กรอกรหัสห้อง เช่น ABC123"
              :disabled="isJoining"
            />
            <button 
              @click="joinRoom" 
              :disabled="isJoining" 
              class="px-6 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-r-lg text-base py-4 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 flex items-center"
            >
              <span v-if="isJoining" class="inline-block mr-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span>{{ isJoining ? 'กำลังเข้าร่วม...' : 'เข้าร่วมห้อง' }}</span>
            </button>
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">ใส่รหัสที่อาจารย์หรือผู้สร้างแบบทดสอบแชร์ให้คุณ</p>
        </div>
        
        <!-- คำแนะนำเพิ่มเติม -->
        <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mt-6">
          <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">วิธีเข้าร่วมห้อง</h3>
          <ul class="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-200">
            <li>คุณจะได้รับรหัสห้องจากผู้สร้างแบบทดสอบ</li>
            <li>กรอกรหัสห้องในช่องด้านบน</li>
            <li>กดปุ่ม "เข้าร่วมห้อง" เพื่อเข้าร่วม</li>
            <li>หากพบปัญหา ลองตรวจสอบว่ารหัสห้องถูกต้องหรือติดต่อผู้สร้างห้อง</li>
          </ul>
        </div>
      </div>
      
      <!-- ปุ่มกลับ -->
      <div class="mt-6 text-center">
        <NuxtLink to="/dashboard/rooms" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          &larr; กลับไปยังหน้าห้องทดสอบ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>