import { ref, type Ref } from 'vue';

// ปรับปรุงตามโครงสร้างของโปรเจค
interface WebSocketMessage {
  type: string;
  payload: any;
}

interface WebSocketAction {
  action: string;
  payload: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private _isConnected: Ref<boolean> = ref(false);
  private messageListeners: Map<string, Array<(payload: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private reconnectTimeoutId: number | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  // Getter for connection status
  get isConnected(): Ref<boolean> {
    return this._isConnected;
  }

  // Connect to WebSocket server
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.socket && this._isConnected.value) {
        console.log('WebSocket already connected');
        resolve(true);
        return;
      }

      try {
        console.log('Connecting to WebSocket server at:', this.url);
        this.socket = new WebSocket(this.url);

        // Setup event handlers
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this._isConnected.value = true;
          this.reconnectAttempts = 0;
          resolve(true);
        };

        this.socket.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.reason || 'No reason provided'} (code: ${event.code})`);
          this._isConnected.value = false;
          
          // Attempt to reconnect if not closed cleanly
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
          
          if (this._isConnected.value) {
            reject(new Error(event.reason || 'Connection closed'));
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.socket.onmessage = (event) => {
          try {
            console.log('WebSocket raw message received:', event.data);
            const message = JSON.parse(event.data) as WebSocketMessage;
            console.log('WebSocket parsed message:', message);
            
            // Notify all listeners for this message type
            this.notifyListeners(message.type, message.payload);
            
            // Also notify generic 'message' listeners
            this.notifyListeners('message', message);
          } catch (e) {
            console.error('Failed to parse WebSocket message:', event.data, e);
          }
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting from WebSocket server');
      this.socket.close();
      this.socket = null;
      this._isConnected.value = false;
      
      // Cancel any pending reconnect
      if (this.reconnectTimeoutId !== null) {
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = null;
      }
    }
  }

  // Send a message to the server
  send(action: WebSocketAction): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected (readyState:', this.socket?.readyState, ')');
      return false;
    }

    try {
      // ตรวจสอบว่า payload มีค่า sessionId ที่ไม่ว่างเปล่า
      if (action.payload && 'sessionId' in action.payload) {
        if (!action.payload.sessionId) {
          console.error('Empty sessionId in WebSocket payload:', action);
          return false;
        }
      }

      const messageStr = JSON.stringify(action);
      console.log('Sending WebSocket message:', messageStr);
      this.socket.send(messageStr);
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }

  // Add a listener for a specific message type
  on<T>(type: string, callback: (payload: T) => void): () => void {
    console.log('Adding listener for event type:', type);
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, []);
    }
    
    const listeners = this.messageListeners.get(type)!;
    listeners.push(callback as (payload: any) => void);
    
    // Return a function to remove this listener
    return () => {
      const index = listeners.indexOf(callback as (payload: any) => void);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // Remove all listeners for a specific message type
  off(type: string): void {
    console.log('Removing all listeners for event type:', type);
    this.messageListeners.delete(type);
  }

  // Notify all listeners of a specific message type
  private notifyListeners(type: string, payload: any): void {
    console.log('Notifying listeners for event type:', type);
    const listeners = this.messageListeners.get(type);
    if (listeners && listeners.length > 0) {
      console.log(`Found ${listeners.length} listeners for event type:`, type);
      for (const listener of listeners) {
        try {
          listener(payload);
        } catch (error) {
          console.error(`Error in WebSocket listener for ${type}:`, error);
        }
      }
    } else {
      console.log('No listeners found for event type:', type);
    }
  }

  // Schedule a reconnection attempt
  private scheduleReconnect(): void {
    if (this.reconnectTimeoutId !== null) {
      clearTimeout(this.reconnectTimeoutId);
    }
    
    this.reconnectTimeoutId = window.setTimeout(() => {
      console.log(`Attempting to reconnect (${++this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect().catch(() => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else {
          console.error('Max reconnect attempts reached');
        }
      });
    }, this.reconnectInterval);
  }
}

// Create a singleton instance with your WebSocket server URL
const websocketService = new WebSocketService('ws://localhost:3000/ws');

export default websocketService;