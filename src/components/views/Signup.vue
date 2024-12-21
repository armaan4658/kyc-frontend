<template>
    <div class="container">
        <div class="form-wrapper">
            <span class="text-large font-800 mb-3" style="padding-bottom: 5px;">Sign Up</span>
            <el-form :model="form" :rules="rules" ref="signupForm" label-width="100px" class="login-form">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="form.name" type="text" placeholder="Enter your name" class="input-field" />
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="form.email" type="email" placeholder="Enter your email" class="input-field" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="Enter your password"
                        class="input-field" />
                </el-form-item>
                <el-form-item style="margin-left: 7%;">
                    <!-- Use type="submit" to trigger form submission -->
                    <el-button type="primary" @click="onSubmit">Register</el-button>
                    <el-button @click="login">Login</el-button>
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
    password: ""
});


const rules = {
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
        {
            min: 4,
            message: "Password must be at least 4 characters",
            trigger: "blur",
        },
    ],
    name: [
        { required: true, message: "Name is required", trigger: "blur" },
        {
            min: 4,
            message: "Name must be at least 4 characters",
            trigger: "blur",
        },
    ],
};

const signupForm = ref();


const onSubmit = () => {
    signupForm.value.validate(async (valid: any) => {
        if (valid) {
            try {
                const response: any = await ApiService.signup({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: 'User'
                })
                if (response.status === 201) {
                    ElMessage.success(response.data.message);
                    router.push({ path: "/login" });
                } else {
                ElMessage.error(response.data.message);
                }
            } catch (error: any) {
                console.error("Sign-up failed", error);
                ElMessage.error(error.response.data.message);
            }
        } else {
            ElMessage.error("Please fix the errors in the form.");
        }
    });
};

const login = () => {
    router.push({ path: "/login" });
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