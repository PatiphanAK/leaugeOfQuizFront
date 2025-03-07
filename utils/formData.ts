export function objectToFormData<T extends Record<string, any>>(data: T): FormData {
    const formData = new FormData();
  
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // กรณี array (ใช้ key[] เพื่อให้ backend อ่านได้)
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else if (value instanceof File) {
          // ถ้าเป็นไฟล์แนบ
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
  
    return formData;
  }
  