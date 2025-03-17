<script setup lang="ts">
import AppHeader from "@/components/Shared/AppHeader.vue";
import AppFooter from "@/components/Shared/AppFooter.vue";
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header/Navigation -->
      <AppHeader />
      
      <!-- Main Content -->
      <main class="flex-grow">
        <slot />
      </main>
      
      <!-- Footer -->
      <AppFooter />
    </div>
</template>
  
