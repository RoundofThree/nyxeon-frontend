import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import getState from '../store/session'
import axios from 'axios'
const axiosConfig = {
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
}
const API = "https://nameless-river-61827.herokuapp.com/oauth/verify"
const setLoggedIn = getState().setLoggedIn

const requiresAuthentication = (to, from, next) => {
  // check session token in cookie with backend 
  try {
    let res = await axios.get(API, axiosConfig)
    if (res.status == 200) {
      setLoggedIn(true)
      if (from != "Home") return next() 
      else return next("/dashboard")
    }
    else { 
      setLoggedIn(false)
      console.log(from)
      if (from != "Home") return next("/")
      else return next() 
    }
  } catch (err) {
    setLoggedIn(false)
    console.log(from)
    if (from != "Home") return next("/")
    else return next() 
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: requiresAuthentication,
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
    beforeEnter: requiresAuthentication,
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/quests/new',
    name: 'NewQuest',
    beforeEnter: requiresAuthentication,
    component: () => import(/* webpackChunkName: "newquest" */ '../views/NewQuest.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  mode: "hash",
  routes
})

export default router
