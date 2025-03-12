export class Helper {
  // ฟังก์ชันเพื่อเติม http:// หาก url ไม่มี
  getHttp(url: string | null): string | null {
    if (url && !url.startsWith('http')) {
      return `http://${url}`;  // เติม http:// หากไม่มี http:// หรือ https://
    }
    return url;
  }

  // ฟังก์ชันเพื่อแปลงข้อมูลเป็น FormData
  createFormDataFromObject(data: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // จัดการกับ array
      if (Array.isArray(value)) {
        value.forEach(item => {
          formData.append(key, item.toString());
        });
      // จัดการกับค่าที่เป็น boolean
      } else if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      // จัดการกับค่าที่เป็น number
      } else if (typeof value === 'number') {
        formData.append(key, value.toString());
      // จัดการกับค่าที่เป็น File (หากมี)
      } else if (value instanceof File) {
        formData.append(key, value);
      // จัดการกับค่าที่ไม่ใช่ null และ undefined
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return formData;
  }
}
