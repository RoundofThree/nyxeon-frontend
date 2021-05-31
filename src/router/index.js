import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import getState from '../store/session'


const requiresAuthentication = (to, from, next) => {
  const state = getState().loggedIn 
  // check session token in cookie with backend 
  if (state) {
    next()
  } else {
    next("/")
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    // beforeEnter: requiresAuthentication,
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    beforeRouteUpdate: requiresAuthentication,
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/quests/new',
    name: 'NewQuest',
    beforeRouteUpdate: requiresAuthentication,
    component: () => import(/* webpackChunkName: "newquest" */ '../views/NewQuest.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  mode: "hash",
  routes
})

export default router
