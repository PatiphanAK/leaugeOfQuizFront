export default defineNuxtRouteMiddleware((to, from) => {
    // This middleware specifically handles Google auth callback paths
    
    // If we're on the callback path, ensure we don't redirect elsewhere
    if (to.path === '/auth/google/callback') {
      // Return explicitly to prevent other middleware from interfering
      return;
    }
    
    // For other paths, continue with normal navigation
    return;
  });