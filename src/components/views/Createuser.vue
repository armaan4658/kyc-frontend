<template>
    <div class="container">
        <div class="form-wrapper">
            <span class="text-large font-800 mb-3" style="padding-bottom: 5px;">Create User</span>
            <el-form :model="form" :rules="rules" ref="userFormRef" label-width="100px" class="login-form">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="form.name" type="test" placeholder="Enter your name" class="input-field" />
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email" type="email" placeholder="Enter your email" class="input-field" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="Enter your password"
                        class="input-field" />
                </el-form-item>
                <el-form-item label="Role" prop="role">
                    <el-select v-model="form.role" placeholder="Select role">
                        <el-option label="Admin" value="Admin"></el-option>
                        <el-option label="User" value="User"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 7%;">
                    <el-button type="primary" @click="onSubmit">Create User</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import ApiService from "@/api/api.service";

const router = useRouter();


const form = reactive({
    name: "",
    email: "",
    password: "",
    role: ""
});


const rules = {
    name: [
        { required: true, message: "Name is required", trigger: "blur" },
    ],
    email: [
        { required: true, message: "Email is required", trigger: "blur" },
        {
            type: "email",
            message: "Please enter a valid email address",
            trigger: ["blur", "change"],
        },
    ],
    password: [
        { required: true, message: "Password is required", trigger: "blur" },
    ],
    role: [
        { required: true, message: "Role is required", trigger: "blur" },
    ]
};

const userFormRef = ref();

const onSubmit = () => {
    userFormRef.value.validate(async (valid: any) => {
        if (valid) {
            try {
                const response: any = await ApiService.createUser(form)

                if (response.status === 201) {
                    resetForm();
                    ElMessage.success("User created successfully!");
                } else {
                    ElMessage.error(response.data.message || "Failed to create user");
                }
            } catch (error: any) {
                ElMessage.error("An error occurred: " + error.response.data.message);
            }
        } else {
            ElMessage.error("Please fix the errors in the form.");
        }
    });
};

// Function to reset the form
const resetForm = () => {
    Object.assign(form, {
        name: "",
        email: "",
        password: "",
        role: "",
    });
    userFormRef.value?.clearValidate(); 
};

</script>

<style scoped>
/* Full-page container */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
}

/* Form wrapper for styling */
.form-wrapper {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    text-align: center;
}

/* Ensure input fields don't stretch */
.input-field {
    width: 100% !important;
}
</style>