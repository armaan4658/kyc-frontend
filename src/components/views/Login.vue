<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import ApiService from '@/api/api.service';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await ApiService.login(this.email, this.password);
        // localStorage.setItem("token", response.data.token); // Save token
        this.$router.push("/dashboard"); // Redirect to dashboard
      } catch (error) {
        console.error("Login failed", error);
      }
    },
  },
};
</script>