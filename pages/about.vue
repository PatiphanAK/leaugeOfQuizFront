<script lang="ts" setup>
useHead({
  title: "เกี่ยวกับ League of Quiz",
  meta: [
    {
      name: "description",
      content:
        "League of Quiz คือเกมควิซแบบหลายผู้เล่นที่ได้แรงบันดาลใจมาจาก Kahoot พัฒนาด้วย Vue3, Nuxt3, GoFiber และ Socket.io",
    },
  ],
});

const frontendTech = ["Vue 3", "Nuxt 3", "Tailwind CSS", "Pinia"];
const backendTech = ["GoFiber","fasthttp", "Gorilla web toolkit (Golrilla Websocket)", "Postgres"];

const features = [
  {
    title: "ล็อกอินผ่าน Google",
    description: "ผู้ใช้สามารถล็อกอินผ่านบัญชี Google ได้",
    done: true,
  },
  {
    title: "สร้างห้องควิซ",
    description:
      "ผู้ดูแลสามารถสร้างและจัดการห้องควิซ รวมถึงเพิ่มคำถามและตั้งเวลา",
    done: true,
  },
  {
    title: "เล่นพร้อมกันหลายคนแบบเรียลไทม์",
    description: "ผู้เล่นสามารถเข้าร่วมห้องเล่นควิซและแข่งขันกันแบบเรียลไทม์",
    done: false,
  },
  {
    title: "แสดงคำถามแบบไดนามิก",
    description:
      "คำถามจะแสดงให้ผู้เล่นทุกคนพร้อมกัน และผู้เล่นต้องส่งคำตอบภายในเวลาที่กำหนด",
    done: false,
  },
  {
    title: "กระดานผู้นำ",
    description: "หลังจบแต่ละรอบ ผู้เล่นสามารถดูคะแนนของตนเองแบบเรียลไทม์",
    done: false,
  },
];
</script>
<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-12">
      <div
        class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        <!-- Header section with logo -->
        <div
          class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-12 text-center text-white"
        >
          <h1 class="text-4xl font-bold mb-2">League of Quiz</h1>
          <p class="text-xl opacity-90">เกมควิซแบบเล่นพร้อมกันหลายคน</p>
        </div>

        <!-- Main content -->
        <div class="p-8">
          <section class="mb-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              เกี่ยวกับโปรเจค
            </h2>
            <p class="text-gray-600 leading-relaxed">
              <span class="font-semibold">League of Quiz</span>
              เป็นเกมควิซแบบหลายผู้เล่นที่ได้แรงบันดาลใจมาจาก Kahoot
              ผู้เล่นสามารถเข้าร่วมห้องเล่นเกม ตอบคำถาม
              และแข่งขันกันแบบเรียลไทม์ เกมถูกพัฒนาด้วย
              <span class="text-blue-600">Vue3</span>,
              <span class="text-blue-600">Nuxt3</span>,
              <span class="text-blue-600">GoFiber</span> และ
              <span class="text-blue-600">Gorilla Websocket</span>
              เพื่อมอบประสบการณ์การเล่นเกมที่ราบรื่นและมีปฏิสัมพันธ์
            </p>
          </section>

          <!-- Technologies section -->
          <section class="mb-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              เทคโนโลยีที่ใช้
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Frontend -->
              <div class="bg-blue-50 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-blue-700 mb-3">
                  Frontend
                </h3>
                <ul class="space-y-2 text-gray-700">
                  <li
                    v-for="(tech, index) in frontendTech"
                    :key="index"
                    class="flex items-start"
                  >
                    <svg
                      class="h-6 w-6 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{{ tech }}</span>
                  </li>
                </ul>
              </div>

              <!-- Backend -->
              <div class="bg-indigo-50 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-indigo-700 mb-3">
                  Backend
                </h3>
                <ul class="space-y-2 text-gray-700">
                  <li
                    v-for="(tech, index) in backendTech"
                    :key="index"
                    class="flex items-start"
                  >
                    <svg
                      class="h-6 w-6 text-indigo-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{{ tech }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Features section -->
          <section class="mb-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">คุณสมบัติ</h2>
            <div class="bg-gray-50 rounded-lg p-6">
              <ul class="space-y-3 text-gray-700">
                <li
                  v-for="(feature, index) in features"
                  :key="index"
                  class="flex items-start"
                >
                  <svg
                    class="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <span class="font-medium">{{ feature.title }}:</span>
                    <span class="text-gray-600">{{ feature.description }}</span>
                    <span
                      v-if="feature.done"
                      class="inline-block bg-green-100 text-green-700 rounded-full text-xs px-2 py-1 ml-2"
                      >สำเร็จ</span
                    >
                    <span
                      v-else
                      class="inline-block bg-yellow-100 text-yellow-700 rounded-full text-xs px-2 py-1 ml-2"
                      >กำลังพัฒนา</span
                    >
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <!-- Installation -->
          <section class="mb-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">การติดตั้ง</h2>

            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              สิ่งที่ต้องติดตั้งก่อน
            </h3>
            <ol
              class="list-decimal list-inside mb-6 text-gray-700 space-y-1 pl-4"
            >
              <li>
                ติดตั้ง <span class="font-semibold">Go</span> (สำหรับ GoFiber
                backend)
              </li>
              <li>
                ติดตั้ง <span class="font-semibold">Bun</span> (สำหรับการจัดการ
                dependency ของ frontend ที่เร็วขึ้น)
              </li>
              <li>
                <span class="font-semibold">ใช้คำสั่ง go run main.go</span>
              </li>
              <li>
                <span class="font-semibold">ใช้คำสั่ง bun install แล้วก็ bun run dev</span>
              </li>
            </ol>

            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              วิธีตั้งค่า
            </h3>
            <div class="mb-4">
              <p class="font-medium mb-2">ตัวอย่าง .env สำหรับ backend:</p>
              <div
                class="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono"
              >
                <pre>
  DB_HOST=localhost
  DB_USER=postgres
  DB_PASSWORD=tatar025
  DB_NAME=mydb
  DB_PORT=5432
  
  # ตัวอย่าง Credential สำหรับ Google OAuth
  # ต้องสร้าง Credential และเพิ่ม allow origin/callback ที่
  # https://console.cloud.google.com/apis/credentials
  
  GOOGLE_CLIENT_ID="12312313131"
  GOOGLE_CLIENT_SECRET="123456789"
  GOOGLE_REDIRECT_URL="http://localhost:3000/auth/google/callback"
  
  JWT_SECRET="1234HelloKub"
  JWT_REFRESH_SECRET="1234Hello"</pre
                >
              </div>
            </div>
          </section>

          <!-- Team/Contact section (optional) -->
          <section>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">ทีมพัฒนา</h2>
            <p class="text-gray-600 leading-relaxed">
              League of Quiz พัฒนาโดยทีม League of Quiz
              ที่มุ่งมั่นสร้างประสบการณ์การเล่นเกมควิซที่สนุกและน่าตื่นเต้น
              สำหรับผู้ใช้ทุกคน
            </p>
            <div class="mt-4 flex justify-center">
              <a
                href="https://github.com/patiphanak/league-of-quiz"
                target="_blank"
                class="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <svg
                  class="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                ดูโปรเจคบน GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
