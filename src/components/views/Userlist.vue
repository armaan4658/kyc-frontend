<template>
    <div class="center-container">
        <el-table :data="userData" style="width: 50%;margin-left: 8%;" v-if="userData.length > 0">
            <!-- Name Column -->
            <el-table-column label="Name" width="180">
                <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                            <div>Name: {{ scope.row.name }}</div>
                            <div>Email: {{ scope.row.email }}</div>
                        </template>
                        <template #reference>
                            <el-tag>{{ scope.row.name }}</el-tag>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>

            <!-- Email Column -->
            <el-table-column label="Email" width="180">
                <template #default="scope">
                    <span>{{ scope.row.email }}</span>
                </template>
            </el-table-column>

            <!-- Role Column -->
            <el-table-column label="Role" width="180">
                <template #default="scope">
                    <span>{{ scope.row.role }}</span>
                </template>
            </el-table-column>
        </el-table>

        <!-- No Data Found Message -->
        <div v-else style="text-align: center; margin: 20px;">
            <el-empty description="No Data Found"></el-empty>
        </div>

        <!-- Pagination -->
        <el-pagination
        v-if="userData.length > 0"
            :current-page="pagination.page"
            :page-size="pagination.limit"
            :total="pagination.totalRecords"
            layout="prev, pager, next, total"
            @current-change="handlePageChange"
            style="margin-top: 20px;"
        ></el-pagination>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import ApiService from '@/api/api.service';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface Pagination {
    page: number;
    limit: number;
    totalRecords: number;
}

const userData = ref<User[]>([]);
const pagination = ref<Pagination>({
    page: 1,
    limit: 5,
    totalRecords: 0,
});

// Fetch User Data
const fetchUserData = async (page: number = 1, limit: number = 5) => {
    try {
        const response = await ApiService.getAllUsers(page, limit);
        if (response.data && response.data.data) {
            userData.value = response.data.data.users;
            pagination.value.totalRecords = response.data.data.totalRecords;
            pagination.value.page = page;
        } else {
            ElMessage.error(response.data.message);
        }
    } catch (error: any) {
        console.error('Error fetching user data:', error);
        ElMessage.error(error.response?.data?.message || 'Error fetching user data');
    }
};

// Handle page change
const handlePageChange = (page: number) => {
    fetchUserData(page);
};

// On mounted, fetch data for the first page
onMounted(() => {
    fetchUserData(pagination.value.page);
});
</script>

<style scoped>
.center-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
}

.el-table {
    margin-bottom: 20px;
}

.el-pagination {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>