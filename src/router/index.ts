import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import HomePage from '@/views/HomePage.vue'
import store from '@/store/index'
import MonitorPage from '@/views/MonitorPage.vue'
import EventMonitorPage from '@/views/EventMonitorPage.vue'
import AllMonitorsPage from '@/views/AllMonitorsPage.vue'
import SelectedEventsByFilterPage from '@/views/SelectedEventsByFilterPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: () => (store.getters.isAuthenticated ? '/home' : '/login')
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/cameras',
    name: 'AllMonitorsPage',
    component: AllMonitorsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/filtro-gravacoes',
    name: 'SelectedEventsByFilter',
    component: SelectedEventsByFilterPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/cameras/:id',
    props: true,
    name: 'Monitor',
    component: MonitorPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/cameras/:id/gravacao/:eventId',
    props: true,
    name: 'MonitorEvento',
    component: EventMonitorPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
