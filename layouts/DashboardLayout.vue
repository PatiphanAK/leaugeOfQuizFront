<!-- layouts/dashboard.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '~/components/Base/Sidebar.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  console.log("Sidebar toggled:", isSidebarOpen.value); // Debug log
};

const closeMobileMenu = () => {
  isSidebarOpen.value = false;
};

// Force sidebar to be visible on component mount on desktop
onMounted(() => {
  // Check if we're on desktop
  if (window.innerWidth >= 640) {
    isSidebarOpen.value = true;
  }
  
  // Debug log to confirm Sidebar component is loaded
  console.log("Dashboard layout mounted, Sidebar should be visible on desktop");
});
</script>

<template>
  <div class="dashboard-layout flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar container with fixed width that reserves space -->
    <div class="w-0 sm:w-64 flex-shrink-0">
      <!-- Sidebar component stays fixed but its parent reserves space -->
      <Sidebar 
        :isOpen="isSidebarOpen" 
        @close-mobile-menu="closeMobileMenu" 
        class="!block" 
      />
    </div>
    
    <!-- Main Content Area - no need for ml-64 because parent div reserves space -->
    <div class="flex-1 flex flex-col overflow-hidden transition-all duration-300">
      <!-- Rest of your content -->
      <header>...</header>
      <main>...</main>
    </div>
  </div>
</template>

<style scoped>
/* Force sidebar to be visible on desktop */
@media (min-width: 640px) {
  :deep(#dashboard-sidebar) {
    transform: translateX(0) !important;
  }
}
</style>