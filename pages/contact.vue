<script lang="ts" setup>
const studentInfo = {
  name: 'ปฏิภาณ อรรคฮาดศรี',
  id: '65070124',
  profileImage: 'https://avatars.githubusercontent.com/u/107915386?s=400&u=322d694da37d2586f62ed1c3a075f40358c74b15&v=4'
};
const socialLinks = [
  {
    title: 'GitHub',
    url: 'https://github.com/PatiphanAK',
    icon: 'github',
    bgColor: 'bg-gray-800 hover:bg-gray-900'
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/patiphan-akkahadsri-959535271/',
    icon: 'linkedin',
    bgColor: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    title: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=100009448836193&locale=th_TH',
    icon: 'briefcase',
    bgColor: 'bg-blue-800 hover:bg-blue-900'
  }
];

const bioInfo = {
  title: 'เกี่ยวกับฉัน',
  description: 'IT KMITL Student, เขียน code ไม่เก่งแต่ตั้งใจอยู่ครับขอให้ไม่โดนรีไทร์ แงงงง'
};
</script>

<template>
  <div class="contact-container p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-center mb-6">ข้อมูลติดต่อ</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col md:flex-row items-center mb-6">
        <div class="md:w-1/3 flex justify-center md:justify-start mb-4 md:mb-0">
          <div class="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            <div v-if="!studentInfo.profileImage" class="w-full h-full flex items-center justify-center bg-blue-500 text-white text-3xl font-bold">
              {{ studentInfo.name.charAt(0) }}
            </div>
            <img v-else :src="studentInfo.profileImage" alt="Profile" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <div class="md:w-2/3">
          <h2 class="text-xl font-semibold text-center md:text-left">{{ studentInfo.name }}</h2>
          <p class="text-gray-600 text-center md:text-left mb-2">รหัสนักศึกษา: {{ studentInfo.id }}</p>
          <div class="border-t pt-4 mt-4">
            <h3 class="font-medium mb-2">{{ bioInfo.title }}</h3>
            <p class="text-gray-700">{{ bioInfo.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Social Links -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">ช่องทางการติดต่อ</h3>
        <div class="flex flex-wrap gap-3">
          <template v-for="(link, index) in socialLinks" :key="index">
            <!-- ใช้ NuxtLink สำหรับลิงก์ภายใน -->
            <NuxtLink 
              v-if="false" 
              :to="link.url" 
              class="flex items-center px-4 py-2 text-white rounded-md"
              :class="link.bgColor"
            >
              <!-- GitHub Icon -->
              <svg v-if="link.icon === 'github'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              
              <!-- LinkedIn Icon -->
              <svg v-else-if="link.icon === 'linkedin'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              
              <!-- Portfolio/Briefcase Icon -->
              <svg v-else-if="link.icon === 'briefcase'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              
              <!-- Email Icon -->
              <svg v-else-if="link.icon === 'mail'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              
              {{ link.title }}
            </NuxtLink>
            
            <a 
              v-else 
              :href="link.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center px-4 py-2 text-white rounded-md"
              :class="link.bgColor"
            >

              <svg v-if="link.icon === 'github'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              
              <svg v-else-if="link.icon === 'linkedin'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              
              <svg v-else-if="link.icon === 'briefcase'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              
              <svg v-else-if="link.icon === 'mail'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              
              {{ link.title }}
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-container {
  font-family: 'Kanit', 'Sarabun', sans-serif;
}
</style>