<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import { useAuth } from '~/composables/Auth/useAuth';
import LoginButton from '~/components/Base/LoginButton.vue';
import ProfileMenu from '~/components/Base/ProfileMenu.vue';

const authStore = useAuthStore();
const { loginWithGoogle, logout } = useAuth();
const user = computed(() => authStore.userProfile || authStore.state?.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isMobileMenuOpen = ref(false);


const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/about', label: 'About us' },
  { path: '/play', label: 'Play' },
  { path: '/contact', label: 'Contact' },
  { path: '/dashboard', label: 'Dashboard' },
];


const isActiveRoute = (path) => {
  const route = useRoute();
  return route.path === path;
};

// Handle logout
const handleLogout = async () => {
  try {
    await logout();
    authStore.clearUser();
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const formattedUser = computed(() => {
  if (!user.value) return null;
  
  return {
    displayName: user.value.username || user.value.displayName || 'User',
    email: user.value.email || '',
    pictureURL: user.value.avatar || user.value.pictureURL || user.value.photoURL || '',
    ...user.value
  };
});

const isDevelopment = ref(false);


onMounted(() => {
  isDevelopment.value = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  if (!authStore.isLoading && !isAuthenticated.value) {
    if (typeof authStore.fetchUser === 'function') {
      authStore.fetchUser();
    } else if (typeof authStore.loadUser === 'function') {
      authStore.loadUser();
    }
  }
});
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <!-- Logo and brand name -->
      <NuxtLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="App Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">League of Quiz</span>
      </NuxtLink>
      
      <!-- Right section (login/profile) -->
      <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <!-- Debug info in dev mode (using ref instead of process.env) -->
        <div v-if="isDevelopment" class="text-xs text-gray-500 mr-2">
          {{ isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}
        </div>
        
        <LoginButton v-if="!isAuthenticated" @login="loginWithGoogle" />
        <ProfileMenu 
          v-else-if="formattedUser" 
          :user="formattedUser" 
          @logout="handleLogout" 
        />
        <div v-else class="text-sm text-gray-500">Loading...</div>
        
        <!-- Mobile menu button -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen" 
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
          aria-controls="navbar-user" 
          :aria-expanded="isMobileMenuOpen"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </div>
      
      <!-- Main menu -->
      <div 
        :class="{'hidden': !isMobileMenuOpen, 'block': isMobileMenuOpen}" 
        class="items-center justify-between w-full md:flex md:w-auto md:order-1" 
        id="navbar-user"
      >
        <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li v-for="(item, index) in navItems" :key="index">
            <NuxtLink 
              :to="item.path"
              :class="[
                isActiveRoute(item.path) ? 'md:text-blue-700 md:dark:text-blue-500' : 'md:hover:text-blue-700 md:dark:hover:text-blue-500',
                'block py-2 px-3 rounded-sm md:bg-transparent md:p-0 dark:text-white',
                isActiveRoute(item.path) ? 'text-white bg-blue-700' : 'text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white md:hover:bg-transparent'
              ]"
              :aria-current="isActiveRoute(item.path) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>