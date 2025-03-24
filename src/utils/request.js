import axios from 'axios';
import { ElMessage } from 'element-plus';
import {BASE_URL } from '@/config/api'

// 创建 Axios 实例
const instance = axios.create({
    baseURL: BASE_URL, // 后端基础地址
    timeout: 10000,                   // 请求超时时间（毫秒）
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在请求发送前添加 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 请求错误处理
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 对响应数据进行处理
        return response.data; // 直接返回 data，简化调用时的代码
    },
    async (error) => {
        // 响应错误处理
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                ElMessage.error('登录已过期，请重新登录');
                localStorage.removeItem('token');
                // 可选：跳转到登录页
                const { default: router } = await import('@/router');
                router.push('/login');
            } else if (status === 500) {
                ElMessage.error('服务器错误，请稍后重试');
            } else {
                ElMessage.error('请求失败：' + error.message);
            }
        } else {
            ElMessage.error('网络异常，请检查连接');
        }
        return Promise.reject(error);
    }
);

export default instance;