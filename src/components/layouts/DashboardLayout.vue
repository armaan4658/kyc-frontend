<template>
  <div>
    <header>
      <nav>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/kyc">KYC</router-link>
        <router-link to="/users">Users</router-link>
        <button @click="logout">Logout</button>
      </nav>
    </header>
    <main>
      <router-view /> <!-- Render dashboard, KYC, or users -->
    </main>
  </div>
</template>

<script>
export default {
  name: "DashboardLayout",
  methods: {
    logout() {
      localStorage.removeItem("token"); // Remove token
      this.$router.push("/login"); // Redirect to login page
    },
  },
};
</script>

<style scoped>
/* Add styles for DashboardLayout here */
</style>