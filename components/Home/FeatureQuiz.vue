<script setup lang="ts">
import { ref } from 'vue';
import SharedQuizCard from '../Shared/SharedQuizCard.vue';

const featuredQuizzes = ref([
  { 
    title: 'ทดสอบความรู้ทั่วไป', 
    description: 'รวบรวมคำถามน่าสนใจจากหลากหลายศาสตร์', 
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b',
    questions: 20,
    players: 230
  },
  { 
    title: 'เทคโนโลยีและคอมพิวเตอร์', 
    description: 'ทดสอบความรู้ด้านไอที เหมาะสำหรับคนทำงานในวงการ', 
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    questions: 15,
    players: 147 
  },
  { 
    title: 'คำศัพท์ภาษาอังกฤษ', 
    description: 'เพิ่มพูนความรู้ภาษาอังกฤษผ่านเกมสนุกๆ', 
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
    questions: 30,
    players: 321
  }
]);

defineEmits(['playQuiz']);
</script>

<template>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ควิซแนะนำ</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">แบบทดสอบยอดนิยมที่ผู้คนกำลังเล่นอยู่ในขณะนี้</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SharedQuizCard 
            v-for="(quiz, index) in featuredQuizzes" 
            :key="index" 
            :quiz="quiz" 
            @play="$emit('playQuiz', quiz)"
          />
        </div>
        
        <div class="text-center mt-12">
          <a href="/play" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
            ดูควิซทั้งหมด
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  </template>
  
