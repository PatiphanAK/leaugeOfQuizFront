import { ref } from 'vue';

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast interface
interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

// สร้าง global state สำหรับ toasts
const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToast() {
  // เพิ่ม toast ใหม่
  const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = nextId++;
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };
    
    toasts.value.push(toast);
    
    // ลบ toast หลังจากเวลาที่กำหนด
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  // ลบ toast ด้วย id
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  // Helper functions สำหรับประเภท toast ต่างๆ
  const success = (message: string, duration = 3000) => addToast(message, 'success', duration);
  const error = (message: string, duration = 5000) => addToast(message, 'error', duration);
  const info = (message: string, duration = 3000) => addToast(message, 'info', duration);
  const warning = (message: string, duration = 4000) => addToast(message, 'warning', duration);
  
  // ลบ toast ทั้งหมด
  const clearToasts = () => {
    toasts.value = [];
  };
  
  return {
    // State
    toasts,
    
    // Methods
    addToast,
    removeToast,
    clearToasts,
    
    // Shortcuts
    success,
    error,
    info,
    warning
  };
}

// สร้าง ToastContainer component สำหรับแสดง toasts
// สามารถนำไปใช้ใน layouts/default.vue เพื่อแสดงผล toasts ทั่วทั้งแอป
export const ToastContainer = {
  setup() {
    const { toasts, removeToast } = useToast();
    
    return {
      toasts,
      removeToast
    };
  },
  template: `
    <div class="toast-container fixed top-4 right-4 z-50 flex flex-col-reverse gap-2">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast px-4 py-3 rounded-md shadow-md min-w-[250px] max-w-md flex items-center justify-between',
            {
              'bg-green-500 text-white': toast.type === 'success',
              'bg-red-500 text-white': toast.type === 'error',
              'bg-blue-500 text-white': toast.type === 'info',
              'bg-yellow-500 text-white': toast.type === 'warning'
            }
          ]"
        >
          <div>{{ toast.message }}</div>
          <button
            @click="removeToast(toast.id)"
            class="ml-2 text-white focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </transition-group>
    </div>
  `
};