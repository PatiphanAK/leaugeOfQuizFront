<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { gameAPI } from '~/api/Game/game.api';
import { useAuthStore } from '~/stores/Auth/useAuthStore';
import type { GameSession, GameStatus } from '@/types/Game/game.interface';

definePageMeta({
  layout: 'dashboard-layout',
  title: 'Rooms',
  useLayoutProps: true
});

const authStore = useAuthStore();
const sessions = ref<GameSession[]>([]);
const loading = ref(true);
const error = ref('');
const currentUserId = ref(authStore.state.user?.id || 0);

// Function to fetch game sessions
const fetchGameSessions = async () => {
  try {
    loading.value = true;
    // Fetch sessions where current user is a host
    const response = await gameAPI.getGameSessions(true);
    sessions.value = response;
    loading.value = false;
  } catch (err) {
    console.error('Error fetching game sessions:', err);
    error.value = 'Failed to load game sessions. Please try again.';
    loading.value = false;
  }
};

// Function to create a placeholder session if none exist
const createPlaceholderSession = async () => {
  try {
    // Get a quiz to create a session with
    const quizResponse = await gameAPI.getQuizzes(1, 1, true);
    if (quizResponse.data.length > 0) {
      const quiz = quizResponse.data[0];
      // Create a new game session
      const newSession = await gameAPI.createGameSession(quiz.ID);
      sessions.value.push(newSession);
    } else {
      error.value = 'No published quizzes available to create a session.';
    }
  } catch (err) {
    console.error('Error creating placeholder session:', err);
    error.value = 'Failed to create a placeholder session.';
  }
};

// Make sure user is authenticated before fetching sessions
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.loadUser();
  }
  
  // Update the current user ID after authentication
  currentUserId.value = authStore.state.user?.id || 0;
  
  // Only fetch sessions if user is authenticated
  if (authStore.isAuthenticated) {
    await fetchGameSessions();
    
    // If no sessions found for current user, create a placeholder
    if (sessions.value.length === 0) {
      await createPlaceholderSession();
    }
  } else {
    error.value = 'Please log in to view your game sessions.';
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Your Game Rooms</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Authentication error -->
    <div v-else-if="!authStore.isAuthenticated" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
      <div class="mt-4">
        <NuxtLink to="/login" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Log In
        </NuxtLink>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>
    
    <!-- Sessions list -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="session in sessions" :key="session.ID" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold">{{ session.Quiz?.Description || 'Game Session' }}</h2>
          <span class="px-2 py-1 text-xs rounded" 
                :class="session.Status? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ session.Status }}
          </span>
        </div>
        
        <div class="text-gray-600 mb-4">
          <p>Session ID: {{ session.ID }}</p>
          <p>Created: {{ new Date(session.CreatedAt).toLocaleDateString() }}</p>
          <p>Quiz: {{ session.QuizID }}</p>
        </div>
        
        <div class="flex space-x-2 mt-4">
          <NuxtLink :to="`/game/sessions/${session.ID}`" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex-1 text-center">
            Join
          </NuxtLink>
          <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Share
          </button>
        </div>
      </div>
      
      <!-- Add new session card -->
      <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer"
           @click="createPlaceholderSession">
        <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <span class="text-2xl text-gray-500">+</span>
        </div>
        <p class="text-gray-600 font-medium">Create New Session</p>
      </div>
    </div>
  </div>
</template>