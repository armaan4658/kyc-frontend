<template>
    <div class="center-container">
        <el-table :data="tableData" style="width: 90%" v-if="tableData.length > 0">
            <!-- Approved On Column -->
            <el-table-column label="Approved On" width="180">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span style="margin-left: 10px">{{ formatDate(scope.row.approved_on) }}</span>
                    </div>
                </template>
            </el-table-column>

            <!-- Submitted At Column -->
            <el-table-column label="Submitted At" width="180">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span style="margin-left: 10px">{{ formatDate(scope.row.submittedAt) }}</span>
                    </div>
                </template>
            </el-table-column>

            <!-- Name Column -->
            <el-table-column label="Name" width="180">
                <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top" width="auto">
                        <template #default>
                            <div>name: {{ scope.row.name }}</div>
                            <div>email: {{ scope.row.email }}</div>
                        </template>
                        <template #reference>
                            <el-tag>{{ scope.row.name }}</el-tag>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>

            <!-- Status Column -->
            <el-table-column label="Status" width="120">
                <template #default="scope">
                    <el-tag :type="getStatusTagType(scope.row.status)">
                        {{ scope.row.status }}
                    </el-tag>
                </template>
            </el-table-column>

            <!-- Approved By Column -->
            <el-table-column label="Approved By" width="180">
                <template #default="scope">
                    {{ scope.row.approved_by || '-' }}
                </template>
            </el-table-column>

            <!-- Operations Column -->
            <el-table-column label="Operations">
                <template #default="scope">
                    <el-button size="small" @click="handleApproveReject(scope.$index, scope.row, 'Approved')"
                        :disabled="scope.row.status !== 'Pending'">
                        Approve
                    </el-button>
                    <el-button size="small" type="danger"
                        @click="handleApproveReject(scope.$index, scope.row, 'Rejected')"
                        :disabled="scope.row.status !== 'Pending'">
                        Reject
                    </el-button>
                    <el-button size="small" type="primary"
                        @click="downloadDocument(scope.row.documentBase64, scope.row.name)">
                        Download
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- No Data Found Message -->
        <div v-else style="text-align: center; margin: 20px;">
            <el-empty description="No Data Found"></el-empty>
        </div>

        <!-- Pagination -->
        <el-pagination v-if="tableData.length > 0" :current-page="pagination.page" :page-size="pagination.limit"
            :total="pagination.totalRecords" layout="prev, pager, next, total" @current-change="handlePageChange"
            style="margin-top: 20px;"></el-pagination>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Timer } from "@element-plus/icons-vue";
import ApiService from "@/api/api.service";

interface KYCSubmission {
    _id: string;
    user: string;
    name: string;
    email: string;
    documentBase64: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedAt: Date;
    approved_by?: string;
    approved_on?: Date;
}

interface Pagination {
    page: number;
    limit: number;
    totalRecords: number;
}

const tableData = ref<KYCSubmission[]>([]);
const pagination = ref<Pagination>({
    page: 1,
    limit: 5,
    totalRecords: 0,
});

// Fetch KYC Data with pagination
const fetchKYCData = async (page: number = 1, limit: number = 5) => {
    try {
        const response = await ApiService.getAllKycSubmissions(page, limit);
        if (response.data && response.data.data) {
            tableData.value = response.data.data.kycSubmissions;
            pagination.value.totalRecords = response.data.data.totalRecords;
            pagination.value.page = page;
        } else {
            ElMessage.error(response.data.message);
        }
    } catch (error: any) {
        console.error("Error fetching KYC data:", error);
        ElMessage.error(error.response.data.message);
    }
};

const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const getStatusTagType = (status: string): string => {
    switch (status) {
        case "Approved":
            return "success";
        case "Rejected":
            return "danger";
        case "Pending":
            return "warning";
        default:
            return "info";
    }
};

const handleApproveReject = (index: number, row: KYCSubmission, status: string) => {
    ApiService.updateKycStatus(row.user, status)
        .then(response => {
            if (response.status === 200) {
                ElMessage.success(response.data.message);
                fetchKYCData(pagination.value.page);
            } else {
                ElMessage.error(response.data.message);
            }
        })
        .catch(error => ElMessage.error(error.response.data.message));
};

const downloadDocument = (base64Data: string, fileName: string) => {
    if (!base64Data) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64Data}`;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Handle page change
const handlePageChange = (page: number) => {
    fetchKYCData(page);
};

onMounted(() => {
    fetchKYCData(pagination.value.page);
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