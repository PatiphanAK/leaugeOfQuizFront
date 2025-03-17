<template>
    <div class="websocket-test">
      <h1>WebSocket Connection Test</h1>
  
      <!-- Connection Status -->
      <div class="status-card">
        <div class="status-indicator" :class="{ connected: isConnected }"></div>
        <span>{{ connectionStatus }}</span>
        <button @click="connect" :disabled="isConnected">Connect</button>
        <button @click="disconnect" :disabled="!isConnected">Disconnect</button>
      </div>
  
      <!-- Join Session Form -->
      <div class="card" v-if="isConnected">
        <h2>Join Game Session</h2>
        <div class="form-group">
          <label>Session ID:</label>
          <input v-model="sessionId" placeholder="Enter session ID" />
        </div>
        <div class="form-group">
          <label>User ID:</label>
          <input v-model="userId" type="number" placeholder="Enter user ID" />
        </div>
        <div class="form-group">
          <label>Nickname:</label>
          <input v-model="nickname" placeholder="Enter nickname" />
        </div>
        <button @click="joinSession" :disabled="!canJoinSession">Join Session</button>
      </div>
  
      <!-- Game Controls -->
      <div class="card" v-if="isJoined">
        <h2>Game Controls</h2>
        <button @click="startGame">Start Game</button>
        <button @click="endGame">End Game</button>
      </div>
  
      <!-- Answer Submission -->
      <div class="card" v-if="isJoined">
        <h2>Submit Answer</h2>
        <div class="form-group">
          <label>Question ID:</label>
          <input v-model="questionId" type="number" placeholder="Enter question ID" />
        </div>
        <div class="form-group">
          <label>Choice ID:</label>
          <input v-model="choiceId" type="number" placeholder="Enter choice ID" />
        </div>
        <div class="form-group">
          <label>Time Spent (seconds):</label>
          <input v-model="timeSpent" type="number" step="0.1" placeholder="Enter time spent" />
        </div>
        <button @click="submitAnswer" :disabled="!canSubmitAnswer">Submit Answer</button>
      </div>
  
      <!-- Chat -->
      <div class="card" v-if="isJoined">
        <h2>Chat</h2>
        <div class="form-group">
          <label>Message:</label>
          <input v-model="chatMessage" placeholder="Type a message..." @keyup.enter="sendChatMessage" />
        </div>
        <button @click="sendChatMessage" :disabled="!chatMessage">Send</button>
      </div>
  
      <!-- Message Log -->
      <div class="card log-card">
        <h2>Message Log</h2>
        <div class="log-controls">
          <button @click="clearLog">Clear Log</button>
        </div>
        <div class="message-log">
          <div v-for="(message, index) in messageLog" :key="index" class="log-entry">
            <span class="log-time">{{ message.time }}</span>
            <span class="log-direction" :class="message.direction">{{ message.direction }}</span>
            <pre class="log-content">{{ message.content }}</pre>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onUnmounted } from 'vue';
  
  // WebSocket connection
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const connectionStatus = computed(() => isConnected.value ? 'Connected' : 'Disconnected');
  
  // Session and user info
  const sessionId = ref('');
  const userId = ref<number | null>(null);
  const nickname = ref('');
  const isJoined = ref(false);
  
  // Answer submission
  const questionId = ref<number | null>(null);
  const choiceId = ref<number | null>(null);
  const timeSpent = ref<number | null>(null);
  
  // Chat
  const chatMessage = ref('');
  
  // Message log
  const messageLog = ref<Array<{
    time: string,
    direction: 'sent' | 'received',
    content: string
  }>>([]);
  
  // Computed properties for form validation
  const canJoinSession = computed(() => 
    sessionId.value && userId.value !== null && nickname.value
  );
  
  const canSubmitAnswer = computed(() => 
    isJoined.value && 
    questionId.value !== null && 
    choiceId.value !== null && 
    timeSpent.value !== null
  );
  
  // Format timestamp for log
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString() + '.' + String(now.getMilliseconds()).padStart(3, '0');
  };
  
  // Add a message to the log
  const logMessage = (content: any, direction: 'sent' | 'received') => {
    let displayContent = content;
    if (typeof content === 'object') {
      displayContent = JSON.stringify(content, null, 2);
    }
    messageLog.value.unshift({
      time: formatTime(),
      direction,
      content: displayContent
    });
  };
  
  // Clear the message log
  const clearLog = () => {
    messageLog.value = [];
  };
  
  // Connect to WebSocket server
  const connect = () => {
    try {
      const serverUrl = 'ws://localhost:3000/ws';
      socket.value = new WebSocket(serverUrl);
      
      socket.value.onopen = () => {
        isConnected.value = true;
        logMessage('WebSocket connection established', 'received');
      };
  
      socket.value.onclose = (event) => {
        isConnected.value = false;
        isJoined.value = false;
        logMessage(`WebSocket connection closed: ${event.reason || 'No reason provided'}`, 'received');
      };
  
      socket.value.onerror = (error) => {
        logMessage(`WebSocket error: ${error}`, 'received');
      };
  
      socket.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          logMessage(message, 'received');
          
          // Handle specific message types
          if (message.type === 'joined') {
            isJoined.value = true;
          } else if (message.error) {
            console.error('Server error:', message.error);
          }
        } catch (e) {
          logMessage(`Failed to parse message: ${event.data}`, 'received');
        }
      };
    } catch (error) {
      logMessage(`Failed to connect: ${error}`, 'received');
    }
  };
  
  // Disconnect from WebSocket server
  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
      isJoined.value = false;
    }
  };
  
  // Send a message to the server
  const sendMessage = (action: string, payload: any) => {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
      logMessage('WebSocket not connected', 'sent');
      return false;
    }
  
    const message = {
      action,
      payload
    };
  
    try {
      socket.value.send(JSON.stringify(message));
      logMessage(message, 'sent');
      return true;
    } catch (error) {
      logMessage(`Failed to send: ${error}`, 'sent');
      return false;
    }
  };
  
  // Join a game session
  const joinSession = () => {
    if (!canJoinSession.value) return;
    
    sendMessage('join_session', {
      sessionId: sessionId.value,
      userId: userId.value,
      nickname: nickname.value
    });
  };
  
  // Start the game
  const startGame = () => {
    if (!isJoined.value) return;
    
    sendMessage('start_game', {
      sessionId: sessionId.value,
      userId: userId.value
    });
  };
  
  // End the game
  const endGame = () => {
    if (!isJoined.value) return;
    
    sendMessage('end_game', {
      sessionId: sessionId.value,
      userId: userId.value
    });
  };
  
  // Submit an answer
  const submitAnswer = () => {
    if (!canSubmitAnswer.value) return;
    
    sendMessage('submit_answer', {
      sessionId: sessionId.value,
      userId: userId.value,
      questionId: questionId.value,
      choiceId: choiceId.value,
      timeSpent: timeSpent.value
    });
  };
  
  // Send a chat message
  const sendChatMessage = () => {
    if (!isJoined.value || !chatMessage.value) return;
    
    sendMessage('chat_message', {
      sessionId: sessionId.value,
      userId: userId.value,
      message: chatMessage.value
    });
    
    chatMessage.value = '';
  };
  
  // Clean up on component unmount
  onUnmounted(() => {
    disconnect();
  });
  </script>
  
  <style scoped>
  .websocket-test {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .status-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .status-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #dc3545;
  }
  
  .status-indicator.connected {
    background-color: #28a745;
  }
  
  h1, h2 {
    margin-top: 0;
  }
  
  h1 {
    color: #343a40;
  }
  
  h2 {
    color: #495057;
    font-size: 1.2rem;
    margin-bottom: 16px;
  }
  
  .form-group {
    margin-bottom: 12px;
  }
  
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: bold;
    color: #495057;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:hover {
    background-color: #0069d9;
  }
  
  button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  
  .log-card {
    max-height: 400px;
  }
  
  .log-controls {
    margin-bottom: 8px;
    text-align: right;
  }
  
  .message-log {
    background-color: #212529;
    color: #f8f9fa;
    border-radius: 4px;
    padding: 8px;
    height: 300px;
    overflow-y: auto;
    font-family: monospace;
  }
  
  .log-entry {
    margin-bottom: 8px;
    border-bottom: 1px solid #444;
    padding-bottom: 8px;
  }
  
  .log-time {
    color: #adb5bd;
    margin-right: 8px;
  }
  
  .log-direction {
    display: inline-block;
    padding: 2px 4px;
    border-radius: 4px;
    margin-right: 8px;
    font-size: 0.8rem;
  }
  
  .log-direction.sent {
    background-color: #007bff;
  }
  
  .log-direction.received {
    background-color: #28a745;
  }
  
  .log-content {
    margin: 4px 0 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  </style>