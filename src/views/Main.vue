<template>
    <el-container class="dashboard-container">
        <!-- 顶部导航栏 -->
        <el-header class="header">
            <div>
                <span class="app-name">那什么什么之类的管理系统</span>
            </div>

            <div>

                <el-dropdown>
                    <span class="user-info">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span class="username">
                            {{ user.nickname }}
                            <el-icon>
                                <ArrowDownBold />
                            </el-icon>
                        </span>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="showEditInfoDialog">修改个人信息</el-dropdown-item>
                            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>

        <!-- 左侧导航栏 + 主内容 + footer -->
        <el-container class="main-container">
            <!-- 左侧导航栏 -->
            <el-aside class="menu-aside" width="200px" height="100%">
                <el-menu :default-active="activeMenu" class="sidebar-menu" @select="handleMenuSelect">
                    <el-menu-item index="/index">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-menu-item v-if="isAdmin" index="/sysusers">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="/settings">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span>设置</span>
                    </el-menu-item>
                    <el-menu-item index="/version">
                        <el-icon>
                            <Flag />
                        </el-icon>
                        <span>版本</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 主内容区域 + footer-->
            <el-container class="content-container">
                <!-- 主内容区域 -->
                <el-main class="content-main">
                    <router-view></router-view>
                </el-main>
                <el-footer class="footer">Copyright</el-footer>
            </el-container>

        </el-container>

    </el-container>


    <!-- 修改用户信息弹窗 -->
    <el-dialog title="修改用户信息" v-model="editInfoDialogVisible" width="50%" max-width="480px">
        <el-form :model="editUserInfo" :rules="editUserInfoRules" ref="editUserInfoForm" label-width="8rem">
            <el-form-item label="姓名：" prop="nickname">
                <el-input v-model="editUserInfo.nickname"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="editUserInfo.password" type="password" clearable show-password></el-input>
            </el-form-item>
            <el-form-item label="再次输入密码：" prop="confirmPassword">
                <el-input v-model="editUserInfo.confirmPassword" type="password" clearable show-password></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="cancleUpdateUserInfo">取消</el-button>
            <el-button type="primary" @click="updateUserInfo">确定</el-button>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { House, User, Setting, Flag, UserFilled, ArrowDownBold } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import request from '@/utils/request';
import API from '@/config/api';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const user = userStore.user;

const isAdmin = computed(() => userStore.user?.role === 'admin');

// 修改用户信息弹窗
const editUserInfoForm = ref(null);
const editInfoDialogVisible = ref(false);
const editUserInfo = ref({
    nickname: user.nickname,
    password: '',
});
const editUserInfoRules = {
    nickname: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== editUserInfo.value.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        },
    ],
};

const showEditInfoDialog = () => {
    editInfoDialogVisible.value = true;
};

// 修改用户信息
const updateUserInfo = async () => {
    try {
        await editUserInfoForm.value.validate();
    } catch (error) {
        return;
    }

    try {
        const response = await request.put(`${API.SYSUSER}`, {
            username: user.username,
            nickname: editUserInfo.value.nickname,
            password: editUserInfo.value.password,
        });
        if (response.code === 0) {
            userStore.setUser(response.data);
            ElMessage.success('密码修改成功');
            editUserInfoForm.value.resetFields();
            editInfoDialogVisible.value = false;
        } else {
            console.log(response);
            ElMessage.error('密码修改失败');
        }
    } catch (error) {
        console.log(error);
        ElMessage.error('修改密码失败');
    };
}

// 取消修改用户信息
const cancleUpdateUserInfo = () => {
    editUserInfoForm.value.resetFields();
    editInfoDialogVisible.value = false;
}

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 菜单选择事件
const handleMenuSelect = (index) => {
    router.push(index);
};


// 退出登录
const logout = () => {
    localStorage.removeItem('token');
    ElMessage.success('已退出登录');
    router.push('/login');
};

</script>

<style scoped>
.dashboard-container {
    height: 100%;
    width: 100%;
    flex-direction: column;
    background-color: rgba(245, 245, 245);
    /* padding: 1px; */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    color: #000;
    padding: 0 2rem;
    margin-bottom: 2px;
}

.content-container {
    /* height: 100%; */
    /* width: 100%; */
    padding: 0 0;
}

.content-main {
    padding: 0 0;
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    margin-top: 2px;
}

.app-name {
    font-size: 20px;
    font-weight: bold;
}

.user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.username {
    color: #000;
}

.main-container {
    width: 100%;
    /* display: flex; */
}

.menu-aside {
    background-color: #fff;
    margin-right: 2px;
}

.sidebar-menu {
    height: 100%;
}
</style>