import { useAuth } from "~/composables/Auth/useAuth";
import { useAuthStore } from "~/stores/Auth/useAuthStore";
export default defineNuxtRouteMiddleware(async (to, from) => {
    // ตรวจสอบว่าเป็นหน้า callback จาก Google หรือไม่
    if (to.path.includes('/auth/google') || to.path.includes('/callback')) {
        console.log('Auth middleware: allowing access to auth path:', to.path);
        // อนุญาตให้เข้าถึงหน้า callback ได้โดยไม่ต้องตรวจสอบการเข้าสู่ระบบ
        return;
    }
    
    // รายการหน้าที่ไม่ต้องล็อกอิน - เฉพาะ /home, /aboutus, และ /contact
    const publicRoutes = ['/', '/home', '/aboutus', '/contact'];
    if (publicRoutes.includes(to.path)) {
        console.log('Auth middleware: allowing access to public route:', to.path);
        return;
    }
    
    const authStore = useAuthStore();
    const { getCurrentUser, loginWithGoogle } = useAuth();
    
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
    
    // ถ้ายังไม่ได้ตรวจสอบผู้ใช้ ให้ตรวจสอบ
    if (!authStore.isAuthenticated && !authStore.isLoading) {
      try {
        console.log('Trying to get current user');
        const user = await getCurrentUser();
        console.log('Current user result:', user);
        
        if (user) {
          authStore.setUser(user);
          // รอให้ state อัปเดต
          await nextTick();
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    }
    
    if (!authStore.isAuthenticated) {
      loginWithGoogle();
      return;
    }
    
    console.log('User authenticated, allowing access to:', to.path);
});