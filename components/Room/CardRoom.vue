<script lang="ts" setup>
import type { Quiz } from '~/types/Quiz/quiz.interface';
import { computed, ref } from 'vue';
import { NuxtLink } from '#components';
import { useRoute } from 'vue-router';
import helper from '~/utils/helper';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import { storeToRefs } from 'pinia';
import { gameAPI, wsApi } from '~/api/Game/game.api';

const route = useRoute();
const isCreating = ref(false);
const authStore = useAuthStore();
const { userProfile } = storeToRefs(authStore);
const creationError = ref('');

const props = defineProps<{
  quiz: Quiz
}>();

// สำหรับตัดข้อความให้สั้นลงถ้าข้อความยาวเกินไป
const truncatedDescription = computed(() => {
  if (!props.quiz.Description) return '';
  return props.quiz.Description.length > 100 
    ? props.quiz.Description.substring(0, 100) + '...' 
    : props.quiz.Description;
});

// ตรวจสอบรูปภาพ (fallback ถ้าไม่มี)
const imageUrl = computed(() => {
  return helper.getHttp(props.quiz.ImageURL) || 'https://picsum.photos/seed/' + props.quiz.ID + '/400/250';
});

// สร้างเกมใหม่และนำทางไปยังหน้าเกม
const handleCreateGame = async () => {
  if (!userProfile.value) {
    // ถ้าผู้ใช้ยังไม่ได้ล็อกอิน ให้นำทางไปหน้าล็อกอิน
    alert('กรุณาล็อกอินก่อนสร้างห้องเกม');
    navigateTo('/login');
    return;
  }
  
  try {
    isCreating.value = true;
    creationError.value = '';
    
    console.log('Creating game session for quiz ID:', props.quiz.ID);
    
    // 1. สร้างเซสชันเกมใหม่ผ่าน API โดยระบุให้ส่ง credentials ด้วย
    const session = await gameAPI.createGameSession(props.quiz.ID);
    
    console.log('Game session created:', session);
    
    // ตรวจสอบว่า session มีค่า ID (ตัวพิมพ์ใหญ่) ที่ถูกต้องหรือไม่
    if (!session || !session.ID) {
      throw new Error('ไม่สามารถสร้างห้องเกมได้: ไม่ได้รับรหัสห้องเกม');
    }
    
    // 2. เชื่อมต่อกับ WebSocket server ถ้ายังไม่ได้เชื่อมต่อ
    if (!wsApi.isConnected.value) {
      console.log('Connecting to WebSocket server...');
      await wsApi.connect();
      console.log('WebSocket connected:', wsApi.isConnected.value);
    }
    
    // 3. เข้าร่วมเกมในฐานะผู้สร้าง (host)
    const joinPayload = {
      sessionId: session.ID, // ใช้ ID (ตัวพิมพ์ใหญ่) แทน id (ตัวพิมพ์เล็ก)
      userId: userProfile.value.id,
      nickname: userProfile.value.displayName || userProfile.value.username || 'Host'
    };
    
    console.log('Joining session with payload:', joinPayload);
    
    const joinResult = wsApi.joinSession(joinPayload);
    console.log('Join session result:', joinResult);
    
    setTimeout(() => {
      console.log('Opening game session in current tab:', session.ID);
      window.location.href = `/game/sessions/${session.ID}`;
    
    }, 1000);
    
  } catch (error) {
    console.error('Failed to create game:', error);
    creationError.value = 'ไม่สามารถสร้างห้องเกมได้ โปรดลองอีกครั้ง';
    alert('ไม่สามารถสร้างห้องเกมได้ โปรดลองอีกครั้ง: ' + (error instanceof Error ? error.message : String(error)));
  } finally {
    isCreating.value = false;
  }
};
</script>

<template>
  <div class="h-full bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
    <div class="relative">
      <img 
        class="w-full h-48 object-cover" 
        :src="imageUrl" 
        :alt="quiz.Title" 
        loading="lazy" 
      />
    </div>
    
    <div class="p-5 flex flex-col h-48">
      <NuxtLink :to="`${route.path}/${quiz.ID}`" class="mb-2">
        <h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          {{ quiz.Title }}
        </h5>
      </NuxtLink>
      
      <p class="mb-3 text-sm text-gray-700 dark:text-gray-400 flex-grow">
        {{ truncatedDescription }}
      </p>
      
      <div v-if="creationError" class="mb-2 text-xs text-red-500">
        {{ creationError }}
      </div>
      
      <div class="mt-auto flex items-center justify-between">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          <span v-if="quiz.CreatedAt">
            {{ new Date(quiz.CreatedAt).toLocaleDateString('th-TH') }}
          </span>
        </div>
        
        <button 
          @click="handleCreateGame"
          :disabled="isCreating"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="isCreating">กำลังสร้าง...</span>
          <span v-else>สร้างห้อง</span>
          <svg v-if="!isCreating" class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>