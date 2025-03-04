export default defineNuxtRouteMiddleware((to, from) => {
    // This middleware specifically handles Google auth callback paths
    console.log('Google auth middleware running for path:', to.path);
    
    // If we're on the callback path, ensure we don't redirect elsewhere
    if (to.path === '/auth/google/callback') {
      console.log('On Google callback path, preventing further redirects');
      // Return explicitly to prevent other middleware from interfering
      return;
    }
    
    // For other paths, continue with normal navigation
    return;
  });