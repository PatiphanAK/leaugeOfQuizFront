<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import Block from '~/components/Dashboard/Block.vue';

definePageMeta({
  middleware: ['auth-middleware'],
  layout: 'dashboard',
});

const authStore = useAuthStore();
const user = computed(() => authStore.userProfile);
const isLoading = computed(() => authStore.isLoading);
const imageError = ref(false);
const currentRoute = useRoute();
const block_meta = [
  {
    title: 'สร้างแบบทดสอบ',
    description: 'สร้างแบบทดสอบใหม่เพื่อให้ผู้เล่นทำ',
    link: `/quizzes`,
    icon: 'plus-circle',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    title: 'ดูคะแนนและประวัติ',
    description: 'ดูคะแนนและประวัติการทำแบบทดสอบ',
    link: '/history',
    icon: 'history',
    color: 'bg-gradient-to-br from-green-500 to-green-600'
  },
  {
    title: 'แก้ไขข้อมูลส่วนตัว',
    description: 'แก้ไขข้อมูลส่วนตัวและรหัสผ่าน',
    link: '/profile',
    icon: 'user',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    title: 'สร้างห้อง',
    description: 'สร้างห้องเพื่อเชิญเพื่อนเข้าร่วม',
    link: '/rooms',
    icon: 'users',
    color: 'bg-gradient-to-br from-amber-500 to-amber-600'
  }
];

const updatedBlockMeta = computed(() => {
  return block_meta.map(item => ({
    ...item,
    link: `${currentRoute.path}${item.link}`
  }));
});


const profileImageUrl = computed(() => {
  const baseUrl = user.value?.pictureURL || 
                  user.value?.photoURL || 
                  user.value?.picture ||
                  '';
  
  if (!baseUrl) return '/assets/pic/auth/fallback-profile-image.jpg';
  if (baseUrl.includes('googleusercontent.com')) {
    const basePart = baseUrl.split('=')[0];
    return `${basePart}=s128-c`;
  }
  
  return baseUrl;
});

const handleImageError = () => {
  imageError.value = true;
};

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'สวัสดีตอนเช้า';
  if (hour < 17) return 'สวัสดีตอนบ่าย';
  return 'สวัสดีตอนเย็น';
});
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 space-y-8">
    <div class="relative">
      <h1 class="text-3xl font-bold mb-2 text-gray-800 dark:text-white flex items-center">
        <span class="mr-2">แดชบอร์ด</span>
        <svg class="w-7 h-7 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </h1>
      <div class="h-1 w-24 bg-blue-500 rounded-full"></div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
    
    <div v-else-if="user" class="space-y-8">
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="p-6 flex items-center space-x-6">
            <div class="relative">
              <img 
                :src="profileImageUrl" 
                @error="handleImageError" 
                class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                alt="โปรไฟล์ผู้ใช้"
              />
              <div class="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div class="text-white">
              <p class="text-sm font-medium opacity-80">{{ greeting }}</p>
              <h2 class="text-2xl font-bold">{{ user.displayName }}</h2>
              <div class="flex items-center mt-1 opacity-80">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm">{{ user.email }}</span>
              </div>
            </div>
          </div>
          <div class="md:flex items-end justify-end p-6 md:pl-0 md:w-1/3">
            <button class="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-lg flex items-center justify-center transition">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732
                3.732z" />
              </svg>
              แก้ไขโปรไฟล์
            </button>
          </div>
        </div>
      </div>

      <!-- Action blocks with BlockItem component -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            เมนูด่วน
          </h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Block
              v-for="(block, index) in updatedBlockMeta"
              :key="index"
              :title="block.title"
              :description="block.description"
              :link="block.link"
              :icon="block.icon"
              :color="block.color"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error state with enhanced styling -->
    <div v-else class="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700/50 shadow-md flex items-center">
      <div class="bg-red-100 dark:bg-red-800/50 rounded-full p-3 mr-4">
        <svg class="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-1">ข้อผิดพลาดในการโหลดข้อมูล</h3>
        <p class="text-red-600 dark:text-red-300">ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง</p>
        <NuxtLink to="/login" class="mt-3 inline-flex items-center text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
          <span>ไปหน้าเข้าสู่ระบบ</span>
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rounded-xl {
  transition: all 0.3s ease;
}

.rounded-xl:hover {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.max-w-6xl {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>