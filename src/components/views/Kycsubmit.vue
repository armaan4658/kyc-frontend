<template>
    <div class="kyc-form">
        <h2>KYC Form</h2>
        <el-form :model="kycformData" :rules="rules" ref="formRef" label-width="120px" class="form">
            <!-- Name Input -->
            <el-form-item label="Name" prop="name">
                <el-input v-model="kycformData.name" placeholder="Enter your name" />
            </el-form-item>

            <!-- Email Input -->
            <el-form-item label="Email" prop="email">
                <el-input v-model="kycformData.email" placeholder="Enter your email" />
            </el-form-item>

            <!-- KYC File Upload -->
            <el-form-item label="KYC PDF" prop="kycFile">
                <el-upload action="" :before-upload="beforeUpload" :file-list="fileList" accept=".pdf"
                    auto-upload="false" :show-file-list="false">
                    <el-button type="primary" :disabled="!!kycformData.kycFile">Upload PDF</el-button>
                </el-upload>
                <div v-if="kycformData.kycFile" class="file-info">
                    <span>{{ kycformData.kycFile.name }}</span>
                    <el-icon class="clear-icon" @click="clearFile">
                        <i class="el-icon-close" style="font-size: 16px; color: black; cursor: pointer;"></i>
                    </el-icon>
                </div>
            </el-form-item>

            <!-- Submit Button -->
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">Submit</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import ApiService from '@/api/api.service';

interface KycformData {
    name: string;
    email: string;
    kycFile: File | null; 
}

// Form data with type annotation
const kycformData = ref<KycformData>({
    name: '',
    email: '',
    kycFile: null,
});

onMounted(()=>{
    let userDetails: any = localStorage.getItem("userInfo");
    if(userDetails) {
        userDetails = JSON.parse(userDetails);
        kycformData.value.name = userDetails.name;
        kycformData.value.email = userDetails.email;
    // formRef.value?.resetFields();
    }
})

// Validation rules
const rules = {
    name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
    email: [
        { required: true, message: 'Email is required', trigger: 'blur' },
        { type: 'email', message: 'Invalid email format', trigger: 'blur' },
    ],
    kycFile: [{ required: true, message: 'KYC PDF is required', trigger: 'change' }],
};

const formRef = ref();
const fileList = ref<File[]>([]);

// Before upload handler to validate file
const beforeUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
        ElMessage.error('Only PDF files are allowed!');
        return false;
    }
    if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        ElMessage.error('File size cannot exceed 5MB!');
        return false;
    }
    kycformData.value.kycFile = file;
    fileList.value = [file];
    return false;
};

// Clear the selected file
const clearFile = () => {
    kycformData.value.kycFile = null;
    fileList.value = [];
};

// Reset the form
const resetForm = () => {
    kycformData.value = {
        name: '',
        email: '',
        kycFile: null,
    };
    fileList.value = [];
    formRef.value?.resetFields();
};


const handleSubmit = () => {
    formRef.value.validate((valid: boolean) => {
        if (valid) {
            const formData = new FormData();
            formData.append('name', kycformData.value.name);
            formData.append('email', kycformData.value.email);

            if (kycformData.value.kycFile) {
                formData.append('document', kycformData.value.kycFile);
            }
            const response = ApiService.submitKyc(formData)
                .then(response => {
                    if (response.status === 201) {
                        ElMessage.success(response.data.message);
                        resetForm();
                    } else {
                        ElMessage.error(response.data.message);
                    }
                })
                .catch(error => ElMessage.error(error.response.data.message))
        } else {
            ElMessage.error('Please complete the form correctly.');
        }
    });
};
</script>

<style scoped>
.kyc-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.kyc-form h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form {
    width: 100%;
}

.file-info {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.clear-icon {
    cursor: pointer;
    color: #f56c6c;
}

.clear-icon:hover {
    color: #d9534f;
}
</style>