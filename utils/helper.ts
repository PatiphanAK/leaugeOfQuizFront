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
      // Special handling for Categories array
      if (key === 'Categories') {
        // Extract just the IDs from category objects and append them
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null && 'ID' in item) {
            formData.append(`${key}[${index}]`, item.ID.toString());
          } else if (typeof item === 'number') {
            formData.append(`${key}[${index}]`, item.toString());
          }
        });
      } else {
        // Handle other arrays
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            // For objects in arrays, serialize to JSON
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          } else {
            formData.append(`${key}[${index}]`, item.toString());
          }
        });
      }
    // จัดการกับค่าที่เป็น boolean
    } else if (typeof value === 'boolean') {
      formData.append(key, value.toString());
    // จัดการกับค่าที่เป็น number
    } else if (typeof value === 'number') {
      formData.append(key, value.toString());
    // จัดการกับค่าที่เป็น File (หากมี)
    } else if (value instanceof File) {
      formData.append(key, value);
    // จัดการกับค่าที่เป็น object แต่ไม่ใช่ File
    } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    // จัดการกับค่าที่ไม่ใช่ null และ undefined
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return formData;
}
}
