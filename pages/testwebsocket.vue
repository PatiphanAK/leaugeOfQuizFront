<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Vue 3 WebSocket Tester</h1>
      
      <div class="mb-6 p-4 border rounded bg-gray-100">
        <div class="flex items-center mb-2">
          <div class="w-3 h-3 rounded-full mr-2" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></div>
          <span>สถานะ: {{ connectionStatus }}</span>
        </div>
        <button 
          @click="toggleConnection" 
          class="px-4 py-2 rounded font-medium"
          :class="isConnected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'"
        >
          {{ isConnected ? 'ยกเลิกการเชื่อมต่อ' : 'เชื่อมต่อ WebSocket' }}
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border rounded p-4">
          <h2 class="text-lg font-semibold mb-2">ส่งข้อความ</h2>
          <div class="mb-4">
            <input 
              v-model="messageToSend" 
              @keyup.enter="sendMessage"
              class="w-full p-2 border rounded mb-2" 
              placeholder="พิมพ์ข้อความที่นี่..." 
              :disabled="!isConnected"
            />
            <button 
              @click="sendMessage" 
              class="px-4 py-2 bg-blue-500 text-white rounded font-medium" 
              :disabled="!isConnected || !messageToSend"
            >
              ส่งข้อความ
            </button>
          </div>
        </div>
        
        <div class="border rounded p-4">
          <h2 class="text-lg font-semibold mb-2">ประวัติข้อความ</h2>
          <div class="h-64 overflow-y-auto border rounded p-2 bg-gray-50">
            <div v-if="messages.length === 0" class="text-gray-500 italic">
              ยังไม่มีข้อความ
            </div>
            <div v-for="(msg, index) in messages" :key="index" class="mb-2 p-2 rounded" :class="msg.type === 'sent' ? 'bg-blue-100' : 'bg-green-100'">
              <div class="text-xs text-gray-500">{{ msg.type === 'sent' ? 'ส่ง' : 'รับ' }} - {{ formatTime(msg.time) }}</div>
              <div>{{ msg.content }}</div>
            </div>
          </div>
          <button 
            @click="clearMessages" 
            class="mt-2 px-3 py-1 bg-gray-200 rounded text-sm"
            :disabled="messages.length === 0"
          >
            ล้างประวัติ
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onBeforeUnmount } from 'vue';
  
  // WebSocket state
  const socket = ref(null);
  const isConnected = ref(false);
  const connectionStatus = computed(() => isConnected.value ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ');
  
  // Messages state
  const messageToSend = ref('');
  const messages = ref([]);
  
  // Connect to WebSocket
  const connectWebSocket = () => {
    // กำหนด URL ของ WebSocket server (ปรับให้ตรงกับ server ของคุณ)
    const wsUrl = 'ws://localhost:8080/ws';
    
    try {
      socket.value = new WebSocket(wsUrl);
      
      socket.value.onopen = () => {
        isConnected.value = true;
        addMessage('เชื่อมต่อ WebSocket สำเร็จ', 'received');
      };
      
      socket.value.onmessage = (event) => {
        addMessage(event.data, 'received');
      };
      
      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error);
        addMessage('เกิดข้อผิดพลาด: ' + error, 'received');
      };
      
      socket.value.onclose = () => {
        isConnected.value = false;
        addMessage('ปิดการเชื่อมต่อ WebSocket', 'received');
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      addMessage('ไม่สามารถเชื่อมต่อ WebSocket ได้: ' + error, 'received');
    }
  };
  
  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.close();
    }
  };
  
  // Toggle connection
  const toggleConnection = () => {
    if (isConnected.value) {
      disconnectWebSocket();
    } else {
      connectWebSocket();
    }
  };
  
  // Send message to server
  const sendMessage = () => {
    if (!messageToSend.value || !isConnected.value) return;
    
    try {
      socket.value.send(messageToSend.value);
      addMessage(messageToSend.value, 'sent');
      messageToSend.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('ไม่สามารถส่งข้อความได้: ' + error, 'received');
    }
  };
  
  // Add message to history
  const addMessage = (content, type) => {
    messages.value.push({
      content,
      type,
      time: new Date()
    });
    
    // Auto scroll to bottom
    setTimeout(() => {
      const messageContainer = document.querySelector('.overflow-y-auto');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }, 50);
  };
  
  // Clear message history
  const clearMessages = () => {
    messages.value = [];
  };
  
  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };
  
  // Clean up on component unmount
  onBeforeUnmount(() => {
    disconnectWebSocket();
  });
  </script>
  
  <style>
  /* Add any additional styling here if needed */
  </style>