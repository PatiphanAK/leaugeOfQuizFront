<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/Auth/useAuthStore';

definePageMeta({
  middleware: ['auth-middleware']
});

const authStore = useAuthStore();
const user = computed(() => authStore.userProfile);
const isLoading = computed(() => authStore.isLoading);
const imageError = ref(false);

// ใช้ computed property เพื่อจัดการ URL รูปโปรไฟล์
const profileImageUrl = computed(() => {
  // ดึง URL พื้นฐานจาก user object
  const baseUrl = user.value?.pictureURL || 
                  user.value?.photoURL || 
                  user.value?.picture ||
                  '';
  
  if (!baseUrl) return '/assets/pic/auth/fallback-profile-image.jpg';
  
  // ถ้าเป็น URL จาก Google user content ให้ปรับแต่งขนาด
  if (baseUrl.includes('googleusercontent.com')) {
    // แยกส่วนพื้นฐานของ URL (ลบพารามิเตอร์ขนาด)
    const basePart = baseUrl.split('=')[0];
    // ขอขนาดเฉพาะสำหรับการโหลดที่เร็วขึ้น (128px)
    return `${basePart}=s128-c`;
  }
  
  return baseUrl;
});

const handleImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">แดชบอร์ด</h1>
    
    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
    
    <div v-else-if="user" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div class="flex items-center mb-6">
        <img 
          :src="profileImageUrl" 
          @error="handleImageError" 
          class="w-16 h-16 rounded-full mr-4 border-2 border-gray-200"
          alt="โปรไฟล์ผู้ใช้"
        />
        <div>
          <h2 class="text-xl font-semibold dark:text-white">ยินดีต้อนรับ {{ user.displayName }}</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ user.email }}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="font-medium mb-2 dark:text-white">สถิติของคุณ</h3>
          <p class="text-gray-600 dark:text-gray-300">ข้อมูลสถิติจะแสดงที่นี่</p>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="font-medium mb-2 dark:text-white">กิจกรรมล่าสุด</h3>
          <p class="text-gray-600 dark:text-gray-300">กิจกรรมล่าสุดจะแสดงที่นี่</p>
        </div>
      </div>
    </div>
    
    <div v-else class="bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-200 dark:border-red-700">
      <p class="text-red-600 dark:text-red-300">ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง</p>
    </div>
  </div>
</template>