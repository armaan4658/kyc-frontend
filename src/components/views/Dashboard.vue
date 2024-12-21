<template>
  <div class="kpi-container">
    <el-row :gutter="20">
      <!-- Total Users -->
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">Total Users</div>
          <div class="kpi-value">{{ kpis.totalUsers }}</div>
        </el-card>
      </el-col>

      <!-- Approved Users -->
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">KYC's Approved</div>
          <div class="kpi-value">{{ kpis.approved }}</div>
        </el-card>
      </el-col>

      <!-- Rejected Users -->
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">KYC's Rejected</div>
          <div class="kpi-value">{{ kpis.rejected }}</div>
        </el-card>
      </el-col>

      <!-- Pending Users -->
      <el-col :span="6">
        <el-card class="kpi-card" shadow="hover">
          <div class="kpi-title">KYC's Pending</div>
          <div class="kpi-value">{{ kpis.pending }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <Kyclist @update-success="fetchKPIData" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import ApiService from '@/api/api.service';
import Kyclist from './Kyclist.vue';

// KPI data (initial state)
const kpis = ref({
  totalUsers: 0,
  approved: 0,
  rejected: 0,
  pending: 0,
});

// Fetch KPI data from API
const fetchKPIData = async () => {
  try {
    const response = await ApiService.getKpiStats()

    if (response.status === 200) {
      kpis.value = response.data.data;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error: any) {
    console.error('Error fetching KPI data:', error);
    ElMessage.error(error.response.data.message);
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchKPIData();
});
</script>

<style scoped>
.kpi-container {
  padding: 20px;
  background-color: #f5f5f5;
}

.kpi-card {
  text-align: center;
  padding: 20px;
}

.kpi-title {
  font-size: 18px;
  color: #909399;
  margin-bottom: 10px;
}

.kpi-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>