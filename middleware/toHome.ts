export default defineNuxtRouteMiddleware(() => {
  const route = useRoute()
  
  if (route.path === "/") {
    return navigateTo("/Home")
  }
})