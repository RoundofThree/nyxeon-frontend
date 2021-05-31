<template>

<nav class="flex items-center justify-between flex-wrap bg-teal p-6 bg-black">
    <div class="flex items-center flex-no-shrink text-white mr-6">
      <span class="font-semibold text-xl tracking-tight">Nyxeon</span>
    </div>
    <div class="block sm:hidden">
      <button @click="toggleNavbar" class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light text-white hover:border-white">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>
    <div :class="showMenu ? 'block': 'hidden'" class="w-full flex-grow sm:flex sm:items-center sm:w-auto">
      <div class="text-sm sm:flex-grow">
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li class="flex items-center">
            <router-link
              class="hover:text-gray-300 text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
              to="/about"
              ><span class="inline-block ml-2">About</span></router-link
            >
          </li>
          <li v-if="loggedIn" class="flex items-center">
            <router-link
              class="hover:text-gray-300 text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
              to="/dashboard"
              ><span class="inline-block ml-2">Dashboard</span></router-link
            >
          </li>
          <li v-if="loggedIn" class="flex items-center">
            <router-link
              class="hover:text-gray-300 text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
              to="/quests/new"
              ><span class="inline-block ml-2">Register quest</span></router-link
            >
          </li>
          <li v-if="loggedIn" class="flex items-center">
            <button
              class="hover:text-gray-300 text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
              @click="logout"
              ><span class="inline-block ml-2">Logout</span></button
            >
          </li>
        </ul>
      </div>
      <div>
        <a href="https://github.com/RoundofThree/nyxeon" class="no-underline inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-gray-700 mt-4 sm:mt-0">View source code</a>
      </div>
    </div>
  </nav>
</template>
<script>
import axios from "axios"
import getState from '../store/session'
const setLoggedIn = getState().setLoggedIn

//const API = "http://localhost:8080/oauth/logout"
const API = "https://nameless-river-61827.herokuapp.com/oauth/logout"
const axiosConfig = {
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
}

export default {
  data() {
    return {
      showMenu: false,
      loggedIn: getState().loggedIn, 
    }
  },
  methods: {
    toggleNavbar: function(){
      this.showMenu = !this.showMenu;
    },
    logout: function() {
      axios.delete(API, axiosConfig).then(res => {
        // server must delete session cookie
        // redirect to / 
        setLoggedIn(false)
        this.$router.push({name: "Home"})
      })
      // refresh page 
      this.$forceUpdate()
    }
  }
}
</script>
