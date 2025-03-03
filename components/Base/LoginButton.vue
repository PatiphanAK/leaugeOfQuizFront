<template>
    <button 
      @click="emit('login')" 
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      เข้าสู่ระบบ
    </button>
  </template>
    
  <script setup>
  const emit = defineEmits(['login']);
  </script>