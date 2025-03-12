<script setup>
import { ref, onMounted } from "vue";
import Sidebar from '~/components/Base/Sidebar.vue';

const isSidebarOpen = ref(true);
const isMobileView = ref(false);

// Toggle sidebar open/closed
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Close sidebar on mobile
const closeMobileMenu = () => {
  if (isMobileView.value) {
    isSidebarOpen.value = false;
  }
};

// Check if we're in mobile view
const checkMobileView = () => {
  isMobileView.value = window.innerWidth < 768;
  // Auto-close sidebar on mobile
  if (isMobileView.value) {
    isSidebarOpen.value = false;
  }
};

// On component mount
onMounted(() => {
  checkMobileView();
  window.addEventListener('resize', checkMobileView);
});
</script>

<template>
  <div class="dashboard-layout flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar Component -->
    <Sidebar :isOpen="isSidebarOpen" @close-mobile-menu="closeMobileMenu" />
    
    <!-- Main Content Area -->
    <div 
      class="flex-1 flex flex-col transition-all duration-300"
      :class="{
        'ml-0 md:ml-64': isSidebarOpen,
        'ml-0 md:ml-20': !isSidebarOpen
      }"
    >
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div class="px-4 py-3 flex items-center justify-between">
          <!-- Mobile menu toggle -->
          <button
            @click="toggleSidebar"
            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <svg v-if="isSidebarOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1 p-4 overflow-y-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>