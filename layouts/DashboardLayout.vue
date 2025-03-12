<template>
    <div class="dashboard-layout flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside
        :class="{
          'translate-x-0 w-64': isSidebarOpen,
          '-translate-x-full w-0 sm:w-64 sm:translate-x-0': !isSidebarOpen
        }"
        class="fixed sm:relative h-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300"
      >
        <Sidebar :isOpen="isSidebarOpen" @close-mobile-menu="closeMobileMenu" />
      </aside>
  
      <!-- Main Content -->
      <div
        :class="{
          'ml-64': isSidebarOpen,
          'ml-0 sm:ml-64': !isSidebarOpen
        }"
        class="flex-1 flex flex-col transition-all duration-300"
      >
        <header class="bg-white dark:bg-gray-800 shadow">
          <div class="px-4 py-3 flex items-center justify-between">
            <!-- Mobile menu button -->
            <button
              @click="toggleSidebar"
              class="sm:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </header>
  
        <main class="flex-1 overflow-y-auto p-4">
          <slot></slot>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const isSidebarOpen = ref(true);
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  const closeMobileMenu = () => {
    isSidebarOpen.value = false;
  };
  </script>
  