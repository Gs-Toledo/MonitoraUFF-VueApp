import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import HomePage from '@/views/HomePage.vue'
import store from '@/store/index';
import MonitorPage from '@/views/MonitorPage.vue';
import EventMonitorPage from '@/views/EventMonitorPage.vue';
import AllMonitorsPage from '@/views/AllMonitorsPage.vue';
import SelectedEventsByFilterPage from '@/views/SelectedEventsByFilterPage.vue';

const routes = [
  {
    path: '/',
    name: 'Root',
    beforeEnter: (to, from, next) => {
      if (store.getters.isAuthenticated) {
        next('/home');
      } else {
        next('/login');
      }
    }
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
    path: '/monitor',
    name: 'AllMonitorsPage',
    component: AllMonitorsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/events-filter',
    name: 'SelectedEventsByFilter',
    component: SelectedEventsByFilterPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/monitor/:id',
    props: true,
    name: 'Monitor',
    component: MonitorPage,
    meta: {requiresAuth: true},
  },
  {
    path: '/monitor/:id/evento/:eventId',
    props: true,
    name: 'MonitorEvento',
    component: EventMonitorPage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
