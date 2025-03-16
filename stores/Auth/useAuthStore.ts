import { defineStore } from 'pinia';
import { useAuth } from '~/composables/Auth/useAuth';
// User interface
interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  displayName?: string;
  photoURL?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const state = reactive({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null,
  });

  // Backward compatibility getters
  const userProfile = computed(() => state.user);
  const isAuthenticated = computed(() => state.isAuthenticated);
  const isLoading = computed(() => state.isLoading);
  const error = computed(() => state.error);

  // Actions
  const setUser = (user: User | null) => {
    state.user = user;
    state.isAuthenticated = !!user;
  };

  const clearUser = () => {
    state.user = null;
    state.isAuthenticated = false;
  };

  const setError = (error: string | null) => {
    state.error = error;
  };

  const setLoading = (loading: boolean) => {
    state.isLoading = loading;
  };

  // Load user data
  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { getCurrentUser } = useAuth();
      const user = await getCurrentUser();
      
      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
      
      return user;
    } catch (error) {
      console.error('Failed to load user:', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
      clearUser();
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add fetchUser as an alias for backward compatibility
  const fetchUser = loadUser;

  // Initialize
  if (process.client) {
    loadUser();
  }

  return {
    // State access
    state,
    // Compatibility getters (direct access to properties)
    userProfile,
    isAuthenticated,
    isLoading,
    error,
    // Methods
    setUser,
    clearUser,
    setError,
    setLoading,
    loadUser,
    fetchUser
  };
});