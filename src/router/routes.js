import { createRouter, createWebHistory } from 'vue-router'
import AccesDenied from '@/views/auth/AccesDenied.vue'
import NotFound from '@/views/auth/NotFound.vue'
import SignIn from '@/views/auth/SignIn.vue'
import SignUp from '@/views/auth/SignUp.vue'
import ContactUs from '@/views/home/ContactUs.vue'
import Home from '@/views/home/Home.vue'
import ProductList from '@/views/product/ProductList.vue'
import ProductUpsert from '@/views/product/ProductUpsert.vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useAuthStore } from '@/stores/authStore'

const isAdmin = () => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return { name: APP_ROUTE_NAMES.SIGN_IN }
  }
  if (authStore.isAdmin) {
    return true
  }

  return { name: APP_ROUTE_NAMES.ACCESS_DENIED }
}

const isAuthenticated = () => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return { name: APP_ROUTE_NAMES.SIGN_IN }
  }
  return true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: APP_ROUTE_NAMES.HOME,
      component: Home,
    },
    {
      path: '/sign-in',
      name: APP_ROUTE_NAMES.SIGN_IN,
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: APP_ROUTE_NAMES.SIGN_UP,
      component: SignUp,
    },
    {
      path: '/acces-denied',
      name: APP_ROUTE_NAMES.ACCESS_DENIED,
      component: AccesDenied,
    },
    {
      path: '/not-found',
      name: APP_ROUTE_NAMES.NOT_FOUND,
      component: NotFound,
    },
    {
      path: '/contact-us',
      name: APP_ROUTE_NAMES.CONTACT_US,
      component: ContactUs,
    },
    {
      path: '/product-list',
      name: APP_ROUTE_NAMES.PRODUCT_LIST,
      component: ProductList,
      beforeEnter: [isAdmin],
    },
    {
      path: '/product-create',
      name: APP_ROUTE_NAMES.PRODUCT_CREATE,
      component: ProductUpsert,
      beforeEnter: [isAdmin],
    },
    {
      path: '/product-update/:id',
      name: APP_ROUTE_NAMES.PRODUCT_UPDATE,
      component: ProductUpsert,
      beforeEnter: [isAdmin],
    },
  ],
})

router.beforeEach(async (toString, from) => {
  const authStore = useAuthStore()
  if (!authStore.initialized) {
    await authStore.initializedAuth()
  }
})

export default router
