import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/Auth/auth.interface';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);

    function setUser(newUser: User) {
        user.value = newUser;
        isAuthenticated.value = true;
    }

    function clearUser() {
        user.value = null;
        isAuthenticated.value = false;
    }

    return {
        user,
        isAuthenticated,
        setUser,
        clearUser,
    };
});