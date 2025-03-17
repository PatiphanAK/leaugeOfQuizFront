<script setup lang="ts">
    import { useAuth } from '~/composables/Auth/useAuth';
    defineEmits(['signup', 'demo']);
    const { loginWithGoogle } = useAuth();
</script>

<template>
    <section class="py-16 bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">พร้อมที่จะเริ่มต้นกับ League of Quiz?</h2>
        <p class="text-xl mb-10 max-w-2xl mx-auto opacity-90">สมัครสมาชิกฟรีวันนี้ และเข้าถึงคลังแบบทดสอบนับพันรายการ หรือสร้างแบบทดสอบของคุณเอง</p>
        <div class="flex flex-wrap justify-center gap-6">
          <button @click="loginWithGoogle()" class="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            สมัครสมาชิกฟรี
          </button>
          <button @click="$emit('demo')" class="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300">
            ดูตัวอย่างเกม
          </button>
        </div>
      </div>
    </section>
</template>
  
