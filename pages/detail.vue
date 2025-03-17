<script lang="ts" setup>
const projectName = 'Mini Project Leauge of Quiz';
const technologies = [
  { name: 'Vue.js', version: '3.x', description: 'Frontend framework' },
  { name: 'TypeScript', version: '4.x', description: 'Type-safe JavaScript' },
  { name: 'Tailwind CSS', version: '3.x', description: 'Utility-first CSS framework' },
];

const developmentPhases = [
  {
    name: 'การวิเคราะห์ความต้องการ',
    startDate: '01/01/2025',
    endDate: '15/01/2025',
    description: 'รวบรวมและวิเคราะห์ความต้องการของผู้ใช้ และกำหนดขอบเขตของโครงการ',
    deliverables: ['เอกสารความต้องการ', 'แผนการพัฒนา'],
  },
  {
    name: 'การออกแบบระบบ',
    startDate: '16/01/2025',
    endDate: '31/01/2025',
    description: 'ออกแบบสถาปัตยกรรม, UX/UI และฐานข้อมูล',
    deliverables: ['เอกสารการออกแบบ', 'Wireframes', 'โครงสร้างฐานข้อมูล'],
  },
  {
    name: 'การพัฒนา',
    startDate: '01/02/2025',
    endDate: '28/02/2025',
    description: 'พัฒนาตามแผนที่วางไว้ และทดสอบแต่ละฟีเจอร์',
    deliverables: ['Source code', 'รายงานการทดสอบ'],
  },
  {
    name: 'การทดสอบระบบ',
    startDate: '01/03/2025',
    endDate: '15/03/2025',
    description: 'ทดสอบระบบโดยรวมและแก้ไขข้อบกพร่อง',
    deliverables: ['รายงานการทดสอบระบบ', 'รายการข้อบกพร่องและการแก้ไข'],
  },
  // Add more phases as needed
];

const issues = [
  {
    id: 1,
    title: 'การเชื่อมต่อ API ไม่เสถียร',
    description: 'ระบบมีปัญหาในการเชื่อมต่อกับ API ภายนอก ทำให้ข้อมูลไม่อัพเดทในบางครั้ง',
    severity: 'สูง',
    status: 'แก้ไขแล้ว',
    solution: 'เพิ่มกลไกการ retry และการจัดการ error รวมถึงการเก็บข้อมูลแคชเพื่อลดการเรียก API',
  },
  {
    id: 2,
    title: 'ปัญหาการแสดงผลบน Safari',
    description: 'พบปัญหาการแสดงผล CSS ที่ไม่ถูกต้องบนเบราว์เซอร์ Safari',
    severity: 'ปานกลาง',
    status: 'แก้ไขแล้ว',
    solution: 'ปรับแต่ง CSS และเพิ่ม vendor prefixes สำหรับ Safari',
  },
  {
    id: 3,
    title: 'ประสิทธิภาพการโหลดข้อมูลช้า',
    description: 'การโหลดข้อมูลจำนวนมากทำให้หน้าเว็บทำงานช้า',
    severity: 'ปานกลาง',
    status: 'กำลังแก้ไข',
    solution: 'ใช้เทคนิค pagination และ lazy loading รวมถึงการปรับแต่ง query ให้มีประสิทธิภาพมากขึ้น',
  },
  {
    id: 4,
    title: 'การจัดการ state ที่ซับซ้อน',
    description: 'การจัดการ state ของแอพพลิเคชันมีความซับซ้อนและยากต่อการบำรุงรักษา',
    severity: 'สูง',
    status: 'แก้ไขแล้ว',
    solution: 'ปรับโครงสร้างการจัดการ state โดยใช้ Pinia หรือ Vuex ให้เป็นระบบมากขึ้น และแบ่งโมดูลให้ชัดเจน',
  },
  {
  id: 5,
  title: 'Socket.IO version client ไม่ตรงกัน',
  description: `พบปัญหาในการเชื่อมต่อกับ WebSocket server ที่ใช้ 
                Socket.IO version ต่างกัน เนื่องจาก client ใช้ version 4.x 
                และ server ใช้ lib Socket.io engine version 1.4.x ที่ตัว lib 
                ไม่ได้รองรับ และไม่ได้รับการอัพเดท`,
    severity: 'สูง',
    status: 'แก้ไขแล้ว',
    solution: `เนื่องจาก lib ไม่ได้มีการ maintain และอัพเดทอีกต่อไป 
                จึงต้องทำการเปลี่ยน lib ใหม่คือ Gorilla WebSocket และทำการปรับโค้ดให้ตรงกับ lib ใหม่ และเสียเวลาในการจัดการ
                room boardcast และ event ต่างๆ ใหม่ เนื่องจาก goriila websocket ไม่มี event อย่าง socket.io`,
},
{
    id: 6,
    title: `record player มีแต่ server query ไม่เจอ`,
    description: `เมื่อมีการเข้าร่วมห้อง แล้วมีการ record แต่ server ไม่เจอ query ที่เกี่ยวข้อง`,
    severity: 'สูง',
    status: 'รอการแก้ไข',
    solution: `ตอนนี้ยังไม่มีการแก้ไข แต่อยู่ในระหว่างการวิเคราะห์ปัญหา`,
}
];
</script>

<template>
  <div class="dev-detail-container p-6 max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ projectName }} - รายละเอียดการพัฒนา</h1>
      <p class="text-slate-600">เอกสารนี้รวบรวมรายละเอียดการพัฒนาและปัญหาที่พบในระหว่างการพัฒนาโครงการ</p>
    </header>

    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4 text-slate-800 border-b pb-2">เทคโนโลยีที่ใช้</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(tech, index) in technologies" :key="index" class="bg-white p-4 rounded-lg shadow">
          <h3 class="font-medium text-slate-800">{{ tech.name }} <span class="text-sm text-slate-500">v{{ tech.version }}</span></h3>
          <p class="text-slate-600 text-sm">{{ tech.description }}</p>
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4 text-slate-800 border-b pb-2">ขั้นตอนการพัฒนา</h2>
      <div class="space-y-6">
        <div v-for="(phase, index) in developmentPhases" :key="index" class="bg-white p-6 rounded-lg shadow">
          <div class="flex flex-wrap justify-between items-start mb-2">
            <h3 class="text-xl font-medium text-slate-800">{{ phase.name }}</h3>
            <div class="text-sm text-slate-500">
              {{ phase.startDate }} - {{ phase.endDate }}
            </div>
          </div>
          <p class="text-slate-700 mb-3">{{ phase.description }}</p>
          <div>
            <h4 class="font-medium text-slate-700 mb-1">ผลลัพธ์ที่ได้:</h4>
            <ul class="list-disc list-inside text-slate-600 text-sm">
              <li v-for="(deliverable, i) in phase.deliverables" :key="i">{{ deliverable }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4 text-slate-800 border-b pb-2">ปัญหาที่พบและการแก้ไข</h2>
      <div class="space-y-6">
        <div v-for="issue in issues" :key="issue.id" class="bg-white p-6 rounded-lg shadow">
          <div class="flex flex-wrap justify-between items-start mb-2">
            <h3 class="text-xl font-medium text-slate-800">{{ issue.title }}</h3>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 text-xs rounded-full" 
                :class="{
                  'bg-red-100 text-red-800': issue.severity === 'สูง',
                  'bg-yellow-100 text-yellow-800': issue.severity === 'ปานกลาง',
                  'bg-blue-100 text-blue-800': issue.severity === 'ต่ำ'
                }">
                {{ issue.severity }}
              </span>
              <span class="px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-green-100 text-green-800': issue.status === 'แก้ไขแล้ว',
                  'bg-purple-100 text-purple-800': issue.status === 'กำลังแก้ไข',
                  'bg-gray-100 text-gray-800': issue.status === 'รอการแก้ไข'
                }">
                {{ issue.status }}
              </span>
            </div>
          </div>
          <p class="text-slate-700 mb-3">{{ issue.description }}</p>
          <div>
            <h4 class="font-medium text-slate-700 mb-1">การแก้ไข:</h4>
            <p class="text-slate-600">{{ issue.solution }}</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-4 text-slate-800 border-b pb-2">บทเรียนที่ได้รับ</h2>
      <div class="bg-white p-6 rounded-lg shadow">
        <ul class="list-disc list-inside text-slate-700 space-y-2">
          <li>การวางแผนและออกแบบที่ดีตั้งแต่ต้นสามารถช่วยลดปัญหาในระหว่างการพัฒนาได้</li>
          <li>การทดสอบบนหลายแพลตฟอร์มและเบราว์เซอร์เป็นสิ่งสำคัญเพื่อให้แน่ใจว่าแอพพลิเคชันทำงานได้อย่างถูกต้อง</li>
          <li>การจัดการ state ที่เหมาะสมช่วยให้การพัฒนาและบำรุงรักษาแอพพลิเคชันทำได้ง่ายขึ้น</li>
          <li>การพิจารณาประสิทธิภาพการทำงานตั้งแต่เริ่มต้นจะช่วยลดการแก้ไขในภายหลัง</li>
          <li>การใช้เทคโนโลยีและไลบรารีที่เป็นมาตรฐานและได้รับการสนับสนุนอย่างต่อเนื่องช่วยลดความเสี่ยงในการพัฒนา</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dev-detail-container {
  font-family: 'Kanit', 'Sarabun', sans-serif;
}
</style>