<template>
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(stat, index) in statistics" :key="index" 
               class="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div class="text-4xl font-bold text-indigo-600 mb-2">{{ stat.value.toLocaleString() }}+</div>
            <div class="text-gray-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const statistics = ref([
    { value: 0, target: 1500, label: 'ผู้ใช้งาน' },
    { value: 0, target: 5000, label: 'แบบทดสอบ' },
    { value: 0, target: 25000, label: 'คำถาม' },
  ]);
  
  const animateCounters = () => {
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = duration * frameRate /.1000;
    let frame = 0;
  
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      statistics.value = statistics.value.map(stat => {
        return {
          ...stat,
          value: Math.floor(progress * stat.target)
        };
      });
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, 1000 / frameRate);
  };
  
  onMounted(() => {
    setTimeout(() => {
      animateCounters();
    }, 500);
  });
  </script>