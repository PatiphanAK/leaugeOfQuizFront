export class Helper {
    getHttp(url: string | null): string | null {
      if (url && !url.startsWith('http')) {
        return `http://${url}`;  // เติม http:// หากไม่มี http:// หรือ https://
      }
      return url;
    }
  }
  