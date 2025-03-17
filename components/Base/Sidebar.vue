<script lang="ts" setup>
import { useAuth } from '~/composables/Auth/useAuth';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});
const authStore = useAuthStore();
const { logout } = useAuth();

const sidebarItems = [
  {
    name: 'แดชบอร์ด',
    svg: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4H1m3 4H1m3 4H1m3 4H1m6.071.286a3.429 3.429 0 1 1 6.858 0M4 1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>',
    path: '/dashboard',
    badge: null
  },
  {
    name: 'สร้างแบบทดสอบ',
    svg: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4H1m3 4H1m3 4H1m3 4H1m6.071.286a3.429 3.429 0 1 1 6.858 0M4 1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>',
    path: '/dashboard/quizzes',
    badge: { text: 'Pro', variant: 'gray' }
  },
  {
    name: 'ประวัติการทำแบบทดสอบ',
    svg: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/></svg>',
    path: '/dashboard/history',
    badge: null
  },
  {
    name: 'โปรไฟล์',
    svg: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.109 17H1v-2a4 4 0 0 1 4-4h.87M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm7.95 2.55a2 2 0 0 1 0 2.828l-6.364 6.364-3.536.707.707-3.536 6.364-6.364a2 2 0 0 1 2.829 0Z"/></svg>',
    path: '/dashboard/profile',
    badge: null
  },
  {
    name: 'ห้องทดสอบ',
    svg: '<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3a3 3 0 1 1-1.614 5.53M15 12a4 4 0 0 1 4 4v1h-3.5M10 4.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 11h3a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/></svg>',
    path: '/dashboard/rooms',
    badge: null
  }
];

const logoutItem = {
  name: 'ออกจากระบบ',
  svg: '<svg class="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12h-9.5m7.5 3l3-3-3-3m-5-2V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1h6a1 1 0 001-1v-3"/></svg>',
  path: null,
  badge: null,
  isLogout: true
};

const emit = defineEmits(['close-mobile-menu']);

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    emit('close-mobile-menu');
  }
};

const handleLogout = async () => {
  try {
    if (process.client) {
      localStorage.setItem('isLoggingOut', 'true');
    }
    
    const success = await logout();
    authStore.clearUser();
    closeSidebarOnMobile();
    if (process.client) {

      localStorage.removeItem('isLoggingOut');
      localStorage.removeItem('authRedirect');
      window.location.href = '/home';
    }
  } catch (error) {
    console.error("Logout failed:", error);
    if (process.client) {
      window.location.href = '/home';
    }
  }
};
</script>

<template>
  <aside 
    id="dashboard-sidebar" 
    class="fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-gray-50 dark:bg-gray-800 shadow-sm"
    :class="[
      isOpen ? 'w-64' : 'w-20',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]" 
    aria-label="Sidebar"
  >
    <div class="h-full px-3 py-4 overflow-y-auto flex flex-col">
      <!-- Sidebar Header -->
      <div class="flex justify-between items-center mb-5 px-1">
        <h2 
          class="text-lg font-semibold text-gray-800 dark:text-white transition-opacity duration-300"
          :class="{'opacity-0 md:opacity-100': isOpen, 'opacity-0 md:hidden': !isOpen}"
        >
          เมนูหลัก
        </h2>
        <button 
          @click="emit('close-mobile-menu')" 
          class="p-1 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 md:hidden"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Sidebar Items -->
      <ul class="space-y-2 font-medium">
        <li v-for="(item, index) in sidebarItems" :key="index">
          <NuxtLink 
            :to="item.path" 
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            :class="{'justify-start': isOpen, 'justify-center md:justify-start': !isOpen}"
            @click="closeSidebarOnMobile"
          >
            <!-- Icon -->
            <span 
              v-html="item.svg"
              :class="{'flex-shrink-0': isOpen, 'mx-auto md:mx-0': !isOpen}"
            ></span>
            
            <!-- Text -->
            <span 
              class="ml-3 whitespace-nowrap transition-all duration-300" 
              :class="{'opacity-100': isOpen, 'opacity-0 w-0 md:opacity-0 md:w-0 hidden md:block': !isOpen}"
            >
              {{ item.name }}
            </span>
            
            <!-- Badge -->
            <span 
              v-if="item.badge && item.badge.variant === 'gray' && isOpen" 
              class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300 transition-all duration-300"
              :class="{'opacity-100': isOpen, 'opacity-0 hidden': !isOpen}"
            >
              {{ item.badge.text }}
            </span>
          </NuxtLink>
        </li>
      </ul>
      
      <!-- Spacer to push logout to bottom -->
      <div class="flex-grow"></div>
      
      <!-- Logout Item (separated from main menu) -->
      <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleLogout"
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
          :class="{'justify-start': isOpen, 'justify-center md:justify-start': !isOpen}"
        >
          <!-- Icon -->
          <span 
            v-html="logoutItem.svg"
            :class="{'flex-shrink-0': isOpen, 'mx-auto md:mx-0': !isOpen}"
          ></span>
          
          <!-- Text -->
          <span 
            class="ml-3 whitespace-nowrap transition-all duration-300 text-red-600 dark:text-red-400 font-medium" 
            :class="{'opacity-100': isOpen, 'opacity-0 w-0 md:opacity-0 md:w-0 hidden md:block': !isOpen}"
          >
            {{ logoutItem.name }}
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>