<template>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ทำไมต้อง League of Quiz?</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">แพลตฟอร์มสร้างเกมควิซออนไลน์ที่ให้คุณได้สนุกกับการเรียนรู้และแบ่งปันความรู้</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="สร้างควิซได้อย่างง่ายดาย" 
            description="สร้างแบบทดสอบของคุณเองได้ในไม่กี่นาที ด้วยอินเตอร์เฟซที่ใช้งานง่ายและมีตัวเลือกการปรับแต่งมากมาย"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard 
            title="เล่นกับเพื่อนแบบเรียลไทม์" 
            description="เชิญเพื่อนเข้าร่วมห้องเกม และแข่งขันกันแบบเรียลไทม์ ดูคะแนนและอันดับแบบทันที"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard 
            title="แบบทดสอบที่หลากหลาย" 
            description="ค้นพบแบบทดสอบหลากหลายประเภท จากวิชาการถึงความบันเทิง เหมาะกับทุกความสนใจและทุกระดับความรู้"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard 
            title="ดูสถิติและผลลัพธ์" 
            description="วิเคราะห์ผลการเล่นด้วยกราฟและสถิติแบบละเอียด เพื่อติดตามความก้าวหน้าและพัฒนาความรู้"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard 
            title="เล่นได้ทุกอุปกรณ์" 
            description="เข้าถึงและเล่นเกมได้ทุกที่ทุกเวลา ผ่านมือถือ แท็บเล็ต หรือคอมพิวเตอร์ ด้วยอินเตอร์เฟซที่รองรับทุกขนาดหน้าจอ"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard 
            title="ข้อมูลปลอดภัย" 
            description="การเข้าถึงบัญชีด้วยระบบรักษาความปลอดภัยระดับสูง และการเข้ารหัสข้อมูลเพื่อปกป้องความเป็นส่วนตัว"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </template>
          </FeatureCard>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import FeatureCard from '~/components/Shared/FeatureCard.vue';
  </script>