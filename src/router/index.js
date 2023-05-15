import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/generateWorkout',
    name: 'generateWorkout',
    component: () => import('../views/GenerateWorkView.vue')
  },
  {
    path: '/searchWorkout',
    name: 'searchWorkout',
    component: () => import('../views/SearchWorkout.vue')
  },
  {
    path: '/workSchedule/:data',
    name: 'allWorkSchedule',
    component: () => import('../views/WorkScheduleView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
