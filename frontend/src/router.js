import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './Home.vue'
import RegisterScreen from './RegisterScreen.vue'
import LoginScreen from './LoginScreen.vue'
// import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView, name: 'Home' },
  { path: '/register', component: RegisterScreen, name: 'Register' },
  { path: '/login', component: LoginScreen, name: 'Login' },
  // { path: '/about', component: AboutView },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})