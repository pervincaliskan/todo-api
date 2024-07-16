<template>

  <div class="form-container">
    <h2>Register</h2>
    <form id="register-form" @submit="register">
      <input id="email" type="email" name="email" placeholder="Email" required v-model="email">
      <input id="password" type="password" name="password" placeholder="Password" required v-model="password">
      <button type="submit">Register</button>
      <router-link class="login-link" to="/login">Login</router-link>

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
    async register(event) {
      event.preventDefault();
      await fetch('http://localhost:3000/auth/register', {
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
          console.log('User registered successfully');
          toast.success('User registered successfully');
          this.$router.push('/login');
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
.login-link {
  display: block;
  margin-top: 10px;
  text-align: center;
  text-decoration: none;
  color: #000;
}

.login-link:hover {
  text-decoration: underline;
}
</style>