<template>
  <div>
    <header>
      <h1>Welcome to Auth Layout</h1>
    </header>
    <main>
      <router-view /> <!-- Render login, signup, or reset -->
    </main>
  </div>
</template>

<script lang="ts">
export default {
  name: "AuthLayout",
};
</script>

<style scoped>
/* Add styles for AuthLayout here */
</style>