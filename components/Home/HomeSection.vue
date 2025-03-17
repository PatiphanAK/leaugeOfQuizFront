<template>
    <section class="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
      <div class="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="relative block w-full h-[60px] text-gray-50 fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
      
      <div class="container mx-auto px-4 py-20 md:py-32">
        <div class="flex flex-col lg:flex-row items-center">
          <div class="lg:w-1/2 lg:pr-10 mb-12 lg:mb-0">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 transform translate-y-0 opacity-100">
              League of Quiz
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90 max-w-lg">
              แพลตฟอร์มสร้างและเล่นเกมควิซออนไลน์แบบเรียลไทม์ ทดสอบความรู้และแข่งขันกับเพื่อนๆ!
            </p>
          </div>
          
          <div class="lg:w-1/2 relative">
            <div class="relative z-10 rounded-lg overflow-hidden shadow-2xl transform transition-all duration-700 translate-y-0 opacity-100">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Quiz Game" class="w-full h-auto">
            </div>
            
            <!-- Decorative elements -->
            <div class="absolute top-1/4 -left-4 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div class="absolute -bottom-8 left-20 w-36 h-36 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div class="absolute top-1/3 right-0 w-20 h-20 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  defineEmits(['playNow', 'howToPlay']);
  </script>
  
  <style scoped>
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  </style>