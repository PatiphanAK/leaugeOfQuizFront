export default defineNuxtRouteMiddleware((to, from) => {
  const route = useRoute()
  
  if (route.path === "/") {
    return navigateTo("/Home")
  }
})