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
    // Prevent any navigation away from this page during authentication
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth/google/callback') {
      console.warn('Callback mounted at unexpected path:', currentPath);
    }
    
    // สร้างการหน่วงเวลาเล็กน้อยเพื่อให้แน่ใจว่าทุกอย่างพร้อม
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
    const response = await $fetch('auth/api/me', {
      baseURL: 'http://localhost:3000',
      credentials: 'include',
    });
    
    if (response && response.user) {
      // อัปเดต store ด้วยข้อมูลผู้ใช้
      authStore.setUser(response.user);
      
      // รอให้ state ถูกอัปเดตจริงๆ
      await nextTick();
      
      // ตรวจสอบว่ามี redirect URL ที่บันทึกไว้หรือไม่
      let redirectPath = '/dashboard'; // กำหนดค่าเริ่มต้นเป็น /dashboard
      
      const savedRedirect = sessionStorage.getItem('auth_redirect');
      
      if (savedRedirect && savedRedirect !== 'null' && savedRedirect !== 'undefined') {
        // ตรวจสอบว่า redirect URL ถูกต้อง
        try {
          const decodedRedirect = decodeURIComponent(savedRedirect);
          // ตรวจสอบว่า URL ไม่นำไปยังเว็บไซต์ภายนอก
          if (decodedRedirect.startsWith('/')) {
            redirectPath = decodedRedirect;
          }
        } catch (e) {
          console.error('Invalid redirect URL:', e);
        }
        // ลบข้อมูล redirect ออกจาก sessionStorage
        sessionStorage.removeItem('auth_redirect');
      }
      
      // ใช้ navigateTo แทน router.push เพื่อให้ทำงานกับ Nuxt routing ได้ดีขึ้น
      // ใช้ await และ replace: true เพื่อให้แน่ใจว่าการนำทางทำงานอย่างถูกต้อง
      // ใช้ window.location.href แทน navigateTo เพื่อหลีกเลี่ยงปัญหากับ middleware
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    } else {
      // กรณีไม่พบข้อมูลผู้ใช้
      console.error('ไม่พบข้อมูลผู้ใช้');
      window.location.href = '/';
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
    window.location.href = '/';
  }
});
</script>