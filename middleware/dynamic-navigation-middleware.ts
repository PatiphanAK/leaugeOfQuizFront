export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    if (to.path.includes('/auth/') || from.path.includes('/auth/') || to.path.includes('/callback') || from.path.includes('/callback')) {
      return;
    }
    const fromSegments = from.path.split('/').filter(Boolean);
    const toSegments = to.path.split('/').filter(Boolean);
    if (fromSegments.length > 1) {
      if (toSegments.length === 0 || toSegments[0] !== fromSegments[0]) {
        const parentPath = fromSegments.length > 2 
          ? `/${fromSegments.slice(0, fromSegments.length - 1).join('/')}` 
          : `/${fromSegments[0]}`;
        return navigateTo(parentPath);
      }
    }
  }
});