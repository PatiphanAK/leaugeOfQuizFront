import { useAuthStore } from "~/stores/Auth/useAuthStore";
export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const { getCurrentUser } = useAuth();
    const router = useRouter();
    
    // ถ้ากำลังโหลดข้อมูล ให้รอจนเสร็จ
    if (authStore.isLoading) {
      await new Promise(resolve => {
        const unwatch = watch(() => authStore.isLoading, (isLoading) => {
          if (!isLoading) {
            unwatch();
            resolve(true);
          }
        });
      });
    }
    
    // ถ้ายังไม่ได้ตรวจสอบผู้ใช้ ให้ตรวจสอบ
    if (!authStore.isAuthenticated && !authStore.isLoading) {
      const user = await getCurrentUser();
      if (user) {
        authStore.setUser(user);
      }
    }
    
    // ถ้าไม่ได้เข้าสู่ระบบ ให้ redirect ไปหน้า login
    if (!authStore.isAuthenticated) {
      // บันทึกหน้าที่ต้องการเข้าถึง เพื่อให้สามารถกลับมาหลังจาก login สำเร็จ
      sessionStorage.setItem('auth_redirect', to.fullPath);
      return navigateTo('/');
    }
});