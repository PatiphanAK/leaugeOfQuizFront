import { useAuthStore } from "~/stores/Auth/useAuthStore";
const API_BASE_URL = 'http://localhost:3000';
export function useAuth() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    // ดึงข้อมูลผู้ใช้ปัจจุบัน
    async function getCurrentUser() {
        try {
          const response: { user?: any } = await $fetch('auth/api/me', {
            baseURL: API_BASE_URL,
            credentials: 'include', // สำคัญมาก!
          });
          
          return response.user || null;
        } catch (error) {
          console.error('Failed to get current user:', error);
          return null;
        }
      }
    
    // เริ่มกระบวนการ login ด้วย Google
    function loginWithGoogle() {
        if (process.client) {
          const redirectUrl = encodeURIComponent(window.location.pathname);
          sessionStorage.setItem('auth_redirect', redirectUrl);
          
          window.location.href = `${API_BASE_URL}/auth/google`;
        }
      }
    
    // ออกจากระบบ
    async function logout(redirectTo = '/') {
        try {
            const response: { success: boolean } = await $fetch('/auth/logout', {
              method: 'POST',
              baseURL: API_BASE_URL,
              credentials: 'include',
        });
        
        if (response.success) {
          // ล้างข้อมูลผู้ใช้
          authStore.clearUser();
          
          // Redirect ไปที่หน้าแรกหรือหน้าที่กำหนด
          router.push(redirectTo);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to logout:', error);
        return false;
      }
    }
    
    return {
      loginWithGoogle,
      getCurrentUser,
      logout,
    };
  }