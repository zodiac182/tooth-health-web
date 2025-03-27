<!-- Login.vue -->
<template>
    <div class="login-container">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form" @submit.prevent="handleLogin" label-width="5rem"
            @keydown.enter.native="handleLogin">
            <!-- <div class="logo-div"><el-image src="/logo.png" :fit="none" /></div> -->
            用户登录
            <el-divider></el-divider>
            <el-form-item prop="username" class="form-item-fixed" label="用户名:">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password" class="form-item-fixed" label="密码:">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" clearable
                    show-password></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <div class="button-container">
                <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">登录</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user'; // 导入 store
import axios from 'axios';
import API from '@/config/api';
import router from '@/router';

const loginForm = reactive({
    username: "",
    password: ""
});

const rules = reactive({
    username: [
        { required: true, message: "请输入用户名!", trigger: "blur" }
    ],
    password: [
        { required: true, min: 6, max: 20, message: "密码长度必须在6到20个字符之间!", trigger: "blur" },
    ]
});

const loading = ref(false);
const loginFormRef = ref(null);
const userStore = useUserStore();

const handleLogin = () => {
    loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                const response = await axios.post(API.LOGIN, loginForm);
                if (response.status === 200 && response.data.code === 0) {
                    localStorage.setItem("token", response.data.data.token);
                    userStore.setUser(response.data.data);
                    // 跳转到首页
                    router.push("/index");
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("登录失败");
            } finally {
                loading.value = false;
            }
        } else {
            ElMessage.error("用户名密码验证失败");
        }
    });
};
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* max-width: 480px; */
    /* margin: 0 20px; */
    padding: 30px 10px;

    background: #fff;
    border-radius: 30px;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
}

.logo-div {
    max-width: 48px;
}

.login-button {
    width: 50%;
    min-width: 2rem;
}

.button-container {
    width:100%;
    display: flex;
    justify-content: center;
}

.forget-password {
    float: right;
}

.el-input {
    width: 260px;
}

/* 固定 form-item 宽度 */
.form-item-fixed {
    width: 100%;

}
</style>