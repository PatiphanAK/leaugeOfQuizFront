<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '~/stores/Auth/useAuthStore';

definePageMeta({
  layout: 'dashboard-layout',
  title: 'Profile',
  useLayoutProps: true
});

const authStore = useAuthStore();
const isLoading = ref(false);
const isSaving = ref(false);
const showSuccess = ref(false);
const errorMessage = ref('');

const form = reactive({
  username: '',
  email: '',
  displayName: '',
  avatar: ''
});

const avatarUrl = computed(() => {
  return form.avatar || '/placeholder-avatar.png';
});

const loadUserData = async () => {
  isLoading.value = true;
  try {
    if (!authStore.isAuthenticated) {
      await authStore.loadUser();
    }
    
    if (authStore.userProfile) {
      form.username = authStore.userProfile.username || '';
      form.email = authStore.userProfile.email || '';
      form.displayName = authStore.userProfile.displayName || '';
      form.avatar = authStore.userProfile.avatar || authStore.userProfile.photoURL || '';
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้ โปรดลองอีกครั้ง';
  } finally {
    isLoading.value = false;
  }
};

// Function to update user profile
const updateProfile = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  
  try {
    // Here you'd call your API to update the user profile
    // const { updateUserProfile } = useAuth();
    // await updateUserProfile(form);
    
    // For now, we'll just simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local state
    if (authStore.state.user) {
      const updatedUser = {
        ...authStore.state.user,
        username: form.username,
        email: form.email,
        displayName: form.displayName,
        avatar: form.avatar
      };
      authStore.setUser(updatedUser);
    }
    
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error('Failed to update profile:', error);
    errorMessage.value = 'ไม่สามารถอัปเดตโปรไฟล์ได้ โปรดลองอีกครั้ง';
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadUserData();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">โปรไฟล์ของฉัน</h1>
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
      <div v-else-if="!authStore.isAuthenticated" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์ของคุณ</p>
        <div class="mt-4">
          <NuxtLink to="/login" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            เข้าสู่ระบบ
          </NuxtLink>
        </div>
      </div>
      
      <!-- Profile Form -->
      <div v-else class="bg-white shadow-md rounded-lg p-6">
        <!-- Success Message -->
        <div v-if="showSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          อัปเดตโปรไฟล์สำเร็จ
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="updateProfile">
          <!-- Avatar -->
          <div class="flex flex-col items-center mb-6">
            <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-2">
              <img :src="avatarUrl" alt="Profile Avatar" class="w-full h-full object-cover" />
            </div>
            <button type="button" class="text-blue-500 hover:text-blue-700 text-sm">
              เปลี่ยนรูปโปรไฟล์
            </button>
          </div>
          
          <!-- Username -->
          <div class="mb-4">
            <label for="username" class="block text-gray-700 text-sm font-bold mb-2">ชื่อผู้ใช้</label>
            <input 
              id="username" 
              v-model="form.username" 
              type="text" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              readonly
            />
            <p class="text-gray-500 text-xs mt-1">ไม่สามารถเปลี่ยนแปลงชื่อผู้ใช้ได้</p>
          </div>
          
          <!-- Display Name -->
          <div class="mb-4">
            <label for="displayName" class="block text-gray-700 text-sm font-bold mb-2">ชื่อที่แสดง</label>
            <input 
              id="displayName" 
              v-model="form.displayName" 
              type="text" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <!-- Email -->
          <div class="mb-6">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">อีเมล</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <!-- Submit Button -->
          <div class="flex items-center justify-end">
            <button 
              type="submit" 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :disabled="isSaving"
            >
              <span v-if="isSaving">กำลังบันทึก...</span>
              <span v-else>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>