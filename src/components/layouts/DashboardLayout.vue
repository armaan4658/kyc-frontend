<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane v-if="role === 'Admin'" label="Dashboard" name="first">
      <Dashboard />
    </el-tab-pane>
    <el-tab-pane v-if="role === 'User'" label="Kyc" name="first">
      <Kyc/>
    </el-tab-pane>
    <el-tab-pane v-if="role === 'Admin'" label="Users" name="second">
      <Userlist />
    </el-tab-pane>
    <el-tab-pane v-if="role === 'Admin'" label="Create User" name="third">
      <Createuser />
    </el-tab-pane>
    <el-tab-pane label="Logout" name="logout">
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { TabsPaneContext } from 'element-plus';
import Dashboard from '../views/Dashboard.vue';
import Userlist from '../views/Userlist.vue';
import Createuser from '../views/Createuser.vue';
import Kyc from '../views/Kyc.vue';

const activeName = ref('first');
const role = ref();
const router = useRouter();

// Function to handle logout
const handleLogout = () => {
  localStorage.clear(); // Clear all local storage data
  router.push('/login'); // Redirect to the login page
};

const handleClick = (tab: TabsPaneContext, event: Event) => {
  if(tab.props.name === 'logout') handleLogout();
  console.log(tab, event);
};
// Fetch role from localStorage on component mount
onMounted(() => {
  const storedRole = localStorage.getItem('role');
  if (storedRole) {
    role.value = storedRole; // Set the role state
  } else {
    console.log('No role found in localStorage');
  }
});
</script>

<style scoped>
/* Add styles for DashboardLayout here */
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

/* Style for the logout tab */
.logout-icon {
  color: red;
  font-weight: bold;
  cursor: pointer;
}
</style>