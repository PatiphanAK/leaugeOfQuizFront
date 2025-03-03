export default defineNuxtRouteMiddleware(() => {
    const route = useRoute()
    const router = useRouter()
    
    if (route.path === "/" && router.hasRoute('/Home/')) {
      return navigateTo("/Home/")
    }
  })