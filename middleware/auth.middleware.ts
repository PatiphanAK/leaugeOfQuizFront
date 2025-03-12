import { useAuth } from "~/composables/Auth/useAuth";
import { useAuthStore } from "~/stores/Auth/useAuthStore";

const auth = useAuth();

export default defineNuxtRouteMiddleware(async (to, from) => {
    // ใช้พารามิเตอร์ to และ from ที่ส่งมาแทนการเรียกใช้ useRoute
    
    // ตรวจสอบว่าเป็นหน้า callback จาก Google หรือไม่
    if (to.path.includes('/auth/google') || to.path.includes('/callback')) {
        // อนุญาตให้เข้าถึงหน้า callback ได้โดยไม่ต้องตรวจสอบการเข้าสู่ระบบ
        return;
    }
    
    // รายการหน้าที่ไม่ต้องล็อกอิน
    const publicRoutes = ['/', '/home', '/aboutus', '/contact'];
    if (publicRoutes.includes(to.path)) {

        return;
    }
    
    const authStore = useAuthStore();
    const { loginWithGoogle } = useAuth();
    
    // ถ้ากำลังโหลดข้อมูล ให้รอจนเสร็จ
    if (authStore.isLoading) {
      await new Promise(resolve => {
        const unwatch = watch(() => authStore.isLoading, (isLoading) => {
          if (!isLoading) {
            unwatch();
            resolve(true);
          }
        });
        
        // เพิ่ม timeout เพื่อป้องกันการรอไม่มีที่สิ้นสุด
        setTimeout(() => {
          unwatch();
          resolve(false);
        }, 5000);
      });
    }
    
    try {
      // ถ้ายังไม่ได้ตรวจสอบผู้ใช้ ให้ตรวจสอบก่อน
      if (!authStore.isAuthenticated && !authStore.isLoading) {
        const user = await auth.getCurrentUser();
        if (user) {
          authStore.setUser(user);
          // รอให้ state อัปเดต
          await nextTick();
        } else {
        }
      }
      
      // ตรวจสอบอีกครั้งหลังจากพยายามดึงข้อมูลผู้ใช้
      if (!authStore.isAuthenticated) {
        // เก็บ URL ที่ผู้ใช้พยายามเข้าถึงเพื่อ redirect กลับหลังจากล็อกอินสำเร็จ
        if (process.client) {
          localStorage.setItem('authRedirect', to.fullPath);
        }
        // เรียกฟังก์ชัน login ก่อนที่จะ redirect
        loginWithGoogle();
        // ใน Nuxt middleware ต้อง return navigateTo โดยตรง
        return navigateTo('/auth/google');
      }
      
      return;
    } catch (error) {
      console.error('Authentication error:', error);
      // กรณีเกิดข้อผิดพลาด ให้ redirect ไปหน้าล็อกอิน
      if (process.client) {
        localStorage.setItem('authRedirect', to.fullPath);
      }
      return navigateTo('/auth/google');
    }
});