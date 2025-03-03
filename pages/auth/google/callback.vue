<!-- pages/auth/google/callback.vue -->
<template>
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-xl font-semibold mb-4">กำลังเข้าสู่ระบบ...</h2>
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useAuthStore } from '~/stores/Auth/useAuthStore';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  onMounted(async () => {
    try {
      // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
      // หมายเหตุ: ตอนนี้ backend ได้ตั้งค่า cookie ให้เราแล้ว
      // เราแค่ต้องดึงข้อมูลผู้ใช้และอัปเดต store
    const response = await $fetch('/api/me', {
    baseURL: 'http://localhost:3000',
    credentials: 'include',
  });
      
      if (response && response.user) {
        // อัปเดต store ด้วยข้อมูลผู้ใช้
        authStore.setUser(response.user);
        
        const savedRedirect = decodeURIComponent(sessionStorage.getItem('auth_redirect'));
        if (savedRedirect) { 
        sessionStorage.removeItem('auth_redirect'); 
        router.push(savedRedirect);
        } else { 
        // ถ้าไม่มี redirect URL ที่บันทึกไว้ ให้ไปที่ dashboard 
        router.push('/dashboard'); 
        }
      } else {
        // กรณีไม่พบข้อมูลผู้ใช้
        console.error('ไม่พบข้อมูลผู้ใช้');
        router.push('/');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
      router.push('/');
    }
  });
  </script>