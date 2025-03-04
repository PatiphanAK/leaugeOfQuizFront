import { defineStore } from 'pinia';
import { authAPI } from '~/api/Auth/auth.api';
import type { User } from '~/types/Auth/auth.interface';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    userProfile: (state) => state.user,
  },

  actions: {
    async fetchUser() {
      try {
        this.isLoading = true;
        const user = await authAPI.getCurrentUser();
        
        if (user) {
          this.user = user;
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.isLoading = false;
      }
    },

    async loginWithGoogle() {
      await authAPI.loginWithGoogle();
      // หมายเหตุ: การ redirect จะเกิดขึ้น ไม่ต้องทำอะไรต่อ
    },

    setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },

    async logout() {
      try {
        this.isLoading = true;
        const success = await authAPI.logout();
        
        if (success) {
          this.user = null;
          this.isAuthenticated = false;
        }
        
        return success;
      } catch (error) {
        console.error('Logout error:', error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * ตรวจสอบสถานะ authentication เมื่อแอปเริ่มต้น
     */
    async initAuth() {
      try {
        this.isLoading = true;
        await this.fetchUser();
        return this.isAuthenticated;
      } catch (error) {
        return false;
      } finally {
        this.isLoading = false;
      }
    },
  },
});