// plugins/router.ts
export default defineNuxtPlugin(() => {
  const router = useRouter();

  /**
   * ฟังก์ชันหา parent path จาก path ปัจจุบัน
   * ตัวอย่าง:
   * - /products/123/reviews -> /products/123
   * - /user/profile/edit -> /user/profile
   * - /quizz/1 -> /quizz
   */
  const getParentPath = (path: string): string => {
    // แยก path ออกเป็นส่วนๆ และลบส่วนที่ว่างเปล่า
    const segments = path.split('/').filter(Boolean);
    
    // ถ้าไม่มี segment หรือมีเพียง segment เดียว ให้ส่งคืน root
    if (segments.length <= 1) {
      return '/';
    }
    
    // สร้าง parent path โดยตัดส่วนสุดท้ายออก
    return '/' + segments.slice(0, segments.length - 1).join('/');
  };

  // เพิ่ม navigation guard สำหรับการนำทางออกจากหน้า
  router.beforeEach((to, from) => {
    // แยกส่วนของเส้นทางต้นทางและปลายทาง
    const fromBase = from.path.split('/')[1]; // เช่น จาก /quizz/1 จะได้ "quizz"
    const toBase = to.path.split('/')[1];    // เช่น ไปยัง /home จะได้ "home"
    
    // ตรวจสอบว่ากำลังออกจากหน้าย่อยและกำลังไปยังส่วนอื่นของแอปหรือไม่
    const isLeavingSubpage = from.path.split('/').filter(Boolean).length > 1;
    const isGoingToUnrelatedSection = fromBase !== toBase;
    
    if (isLeavingSubpage && isGoingToUnrelatedSection) {
      // หา parent path ของเส้นทางปัจจุบัน
      const parentPath = getParentPath(from.path);
      
      // นำทางไปยัง parent path แทน
      return parentPath;
    }
  });
});
