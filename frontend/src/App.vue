<script>
  import { toast } from 'vue3-toastify';
  export default {
    mounted() {
      this.$router.beforeEach((to, from, next) => {
        const publicRoutes = ['/login', '/register'];
        const token = localStorage.getItem('token');
        if (!token && !publicRoutes.includes(to.path)) {
          toast.error('You need to login to access this page');
          next('/login');
        } else {
          next();
        }
      });
    }
  }
</script>

<template>
    <router-view></router-view>
</template>