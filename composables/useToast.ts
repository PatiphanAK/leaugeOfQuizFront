export const useToast = () => {
    const success = (msg: string) => {
      console.log('✅ Success:', msg);
      // You could implement a more sophisticated toast here later
    };
    
    const error = (msg: string) => {
      console.error('❌ Error:', msg);
      // You could implement a more sophisticated toast here later
    };
    
    return {
      success,
      error
    };
  };