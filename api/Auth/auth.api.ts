import type { User } from "~/types/Auth/auth.interface";

const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const authAPI = {
  /**
   * เริ่มต้นการ login ด้วย Google (จะ redirect ไปที่ Google)
   */
  async loginWithGoogle() {
    if (process.client) {
      window.location.href = `${BASE_URL}/auth/google`;
    }
  },

  /**
   * ดึงข้อมูลผู้ใช้ปัจจุบัน
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await useFetch<{ user: User }>(`${BASE_URL}/api/me`, {
        credentials: 'include', // ส่ง cookies ไปด้วย
        headers: {
          'Accept': 'application/json',
        }
      });
      
      return data.value?.user || null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  /**
   * ออกจากระบบ
   */
  async logout(): Promise<boolean> {
    try {
      const { data } = await useFetch<{ success: boolean }>(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      return data.value?.success || false;
    } catch (error) {
      console.error('Failed to logout:', error);
      return false;
    }
  },

  /**
   * เช็คว่า user อยู่ในสถานะ authenticated หรือไม่
   */
  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
};