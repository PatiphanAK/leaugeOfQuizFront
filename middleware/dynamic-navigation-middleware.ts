export default defineNuxtRouteMiddleware((to, from) => {
  // ทำงานเฉพาะฝั่ง client
  if (process.client) {
    // ไม่ใช้ middleware นี้กับเส้นทางที่เกี่ยวข้องกับการ authenticate
    if (to.path.includes('/auth/') || from.path.includes('/auth/') || to.path.includes('/callback') || from.path.includes('/callback')) {
      return;
    }
    
    // แยกเส้นทางของหน้าปัจจุบันออกเป็นส่วนๆ
    const fromSegments = from.path.split('/').filter(Boolean);
    
    // แยกเส้นทางปลายทางออกเป็นส่วนๆ
    const toSegments = to.path.split('/').filter(Boolean);
    
    // ตรวจสอบว่ากำลังออกจากหน้าย่อยหรือไม่ (มี segments มากกว่า 1)
    if (fromSegments.length > 1) {
      // ตรวจสอบว่าเส้นทางปลายทางไม่ได้อยู่ภายใต้เส้นทางเดียวกัน
      // เช่น จาก /products/123/reviews ไปยัง /home
      if (toSegments.length === 0 || toSegments[0] !== fromSegments[0]) {
        // สร้างเส้นทางย้อนกลับไป parent path
        const parentPath = fromSegments.length > 2 
          ? `/${fromSegments.slice(0, fromSegments.length - 1).join('/')}` 
          : `/${fromSegments[0]}`;
          
        // ส่งกลับไปยัง parent path
        return navigateTo(parentPath);
      }
    }
  }
});