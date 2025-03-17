<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['logout']);
const isUserMenuOpen = ref(false);
const imageError = ref(false);
const isImageLoading = ref(true);


const profileImageUrl = computed(() => {
  const baseUrl = props.user.pictureURL || 
                  props.user.photoURL || 
                  props.user.picture ||
                  props.user.avatar ||
                  '';
  
  console.log('Profile image URL source:', baseUrl);
  
  if (!baseUrl) return '/assets/pic/auth/fallback-profile-image.jpg';
  if (baseUrl.includes('googleusercontent.com')) {
    const basePart = baseUrl.split('=')[0];
    return `${basePart}=s128-c`;
  }
  
  return baseUrl;
});

const displayName = computed(() => {
  return props.user.displayName || props.user.username || 'User';
});

const email = computed(() => {
  return props.user.email || '';
});

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = (e) => {
  if (isUserMenuOpen.value && !e.target.closest('#user-menu-button') && !e.target.closest('#user-dropdown')) {
    isUserMenuOpen.value = false;
  }
};

const handleImageError = () => {
  console.error('Profile image failed to load:', profileImageUrl.value);
  imageError.value = true;
  isImageLoading.value = false;
};

const handleImageLoaded = () => {
  console.log('Profile image loaded successfully');
  isImageLoading.value = false;
};

onMounted(() => {
  console.log('ProfileMenu mounted, preloading image');
  
  document.addEventListener('click', closeUserMenu);
  
  if (profileImageUrl.value !== '/assets/pic/auth/fallback-profile-image.jpg') {
    const img = new Image();
    img.src = profileImageUrl.value;
    img.onload = handleImageLoaded;
    img.onerror = handleImageError;
  } else {
    isImageLoading.value = false;
  }
});

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu);
});
</script>

<template>
  <div class="relative">

    <button 
      id="user-menu-button"
      @click="toggleUserMenu" 
      type="button" 
      class="flex items-center justify-center text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 w-8 h-8 overflow-hidden"
    >
      <span class="sr-only">User Info</span>
      
      <!-- Loading spinner -->
      <div v-if="isImageLoading" class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
      
      <!-- Profile image (if loaded successfully) -->
      <img 
        v-else-if="!imageError"
        class="w-full h-full object-cover"
        :src="profileImageUrl" 
        @error="handleImageError"
        :alt="`${displayName}'s profile image`"
      />
      
      <!-- Fallback image (if error) -->
      <img 
        v-else
        class="w-full h-full object-cover" 
        src="/assets/pic/auth/fallback-profile-image.jpg" 
        alt="Profile image placeholder"
      />
    </button>
    
    <!-- Dropdown menu -->
    <div 
      id="user-dropdown"
      v-show="isUserMenuOpen"
      class="absolute z-50 right-0 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 w-48"
    >
      <div class="px-4 py-3">
        <span class="block text-sm text-gray-900 dark:text-white">{{ displayName }}</span>
        <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ email }}</span>
      </div>
      <ul class="py-2" aria-labelledby="user-menu-button">
        <li>
          <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
            โปรไฟล์
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
            แดชบอร์ด
          </NuxtLink>
        </li>
        <li>
          <button
            @click="emit('logout')"
            class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            ออกจากระบบ
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>