<template>
  <div class="form-container">
    <h2>Login</h2>
    <form id="login-form" @submit="login">
      <input id="email" type="email" name="email" placeholder="Email" required v-model="email">
      <input id="password" type="password" name="password" placeholder="Password" required v-model="password">
      <button type="submit">Login</button>
      <router-link class="register-link" to="/register">Register</router-link>
    </form>
  </div>


</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login(event) {
      event.preventDefault();
      await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
        credentials: 'include',
      }).then(async (response) => {
        const json = await response.json();

        if (response.status === 200) {
          toast.success('User logged in successfully');
          console.log('User logged in successfully');
          this.$router.push('/');
          localStorage.setItem('token', json.token);
        } else {
          toast.error(json.message);
          throw new Error(json.message);
        }
      });
    },
  },
}
</script>

<style scoped>
.register-link {
  display: block;
  margin-top: 10px;
  text-align: center;
  text-decoration: none;
  color: #000;
}

.register-link:hover {
  text-decoration: underline;
}
</style>