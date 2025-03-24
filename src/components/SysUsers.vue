<template>
    <el-container class="toolbar">
        <!-- 操作按钮 -->
        <el-button type="primary" @click="newUserDialog" plain>
            <el-icon>
                <CirclePlus />
            </el-icon>
            新增用户
        </el-button>
    </el-container>
    <el-container class="users-container">
        <!-- 用户列表 -->
        <el-table :data="users" class="user-table">
            <el-table-column prop="username" label="用户名" align="center" sortable></el-table-column>
            <el-table-column prop="nickname" label="姓名" align="center" sortable></el-table-column>
            <el-table-column prop="role" label="角色" align="center" sortable>
                <template v-slot="scope">
                    {{ scope.row.role === 'admin' ? '管理员' : '用户' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template v-slot="scope">
                    <el-tooltip class="item" content="编辑" placement="top">
                        <el-button type="primary" :icon="Edit" @click="showEditRoleDialog(scope.row)" plain circle>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" content="删除" placement="top">
                        <el-button type="primary" :icon="Delete" @click="deleteUser(scope.row.ID)" plain circle>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" content="重置密码" placement="top">
                        <el-button type="primary" :icon="RefreshRight" @click="resetPassword(scope.row.ID)" plain
                            circle>
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增用户弹窗 -->
        <el-dialog title="新增用户" v-model="newUserDiaglogVisible" width="40%" max-width="480px">
            <el-form :model="newUser" :rules="rules" ref="newUserForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="newUser.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="nickname">
                    <el-input v-model="newUser.nickname" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="newUser.role" placeholder="请选择角色">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="普通用户" value="user"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="newUserDiaglogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </template>
        </el-dialog>

        <!-- 修改角色弹窗 -->
        <el-dialog title="修改用户" v-model="editDialogVisible" width="30%" max-width="360px">
            <el-form :model="editUser" :rules="editRules" ref="editUserForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editUser.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="editUser.role" placeholder="请选择角色">
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="普通用户" value="user"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updateUserRole">确定</el-button>
            </template>
        </el-dialog>

    </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';
import API from '@/config/api';
import { Edit, Delete, RefreshRight, CirclePlus } from '@element-plus/icons-vue';

const users = ref([]); // 用户列表
const newUserDiaglogVisible = ref(false); // 控制弹窗显示
const editDialogVisible = ref(false);

const newUserForm = ref(null); // 表单引用
const editUserForm = ref(null);

// 新增用户表单数据
const newUser = ref({
    username: '',
    nickname: '',
    role: '',
});

const editUser = ref({
    id: null,
    username: '',
    role: '',
});

// 表单验证规则
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[\w|\d]*$/, message: '只允许字母、数字', trigger: 'blur' },
    ],
    nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};

// 获取用户列表
const fetchUsers = async () => {
    try {
        const response = await request.get(API.USERS);
        if (response.code === 0) {
            users.value = response.data;
        } else {
            ElMessage.error('获取用户列表失败');
        }
    } catch (error) {
        ElMessage.error('请求失败: ' + error.message);
    }
};

// 显示新增用户弹窗
const newUserDialog = () => {
    newUser.value = { username: '', nickname: '', role: '' }; // 重置表单
    newUserDiaglogVisible.value = true;
};

// 新增用户
const addUser = () => {
    newUserForm.value.validate(async (valid) => {
        if (valid) {
            try {
                const response = await request.post(API.SYSUSER, newUser.value);
                if (response.code === 0) {
                    ElMessage.success('用户添加成功');
                    newUserDiaglogVisible.value = false;
                    fetchUsers(); // 刷新列表
                } else {
                    ElMessage.error('添加用户失败');
                }
            } catch (error) {
                ElMessage.error('请求失败: ' + error.message);
            }
        }
    });
};

const showEditRoleDialog = (user) => {
    editUser.value = { ...user }; // 复制用户信息
    editDialogVisible.value = true;
};

// 修改用户角色
const updateUserRole = async () => {
    try {
        const response = await request.put(`${API.UPDATEROLE}`, {
            username: editUser.value.username,
            role: editUser.value.role,
        });
        if (response.code === 0) {
            ElMessage.success('角色更新成功');
            editDialogVisible.value = false;
            fetchUsers();
        } else {
            ElMessage.error('更新角色失败');
        }
    } catch (error) {
        ElMessage.error('请求失败: ' + error.message);

    };
};

// 删除用户
const deleteUser = async (id) => {
    try {
        await ElMessageBox.confirm('确定删除该用户吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
    }
    catch (cancel) {
        // 用户点击了取消
        return;
    }
    try {
        const response = await request.delete(`${API.SYSUSER}/${id}`);
        if (response.code === 0) {
            ElMessage.success('用户删除成功');
            fetchUsers();
        } else {
            ElMessage.error('删除用户失败');
        }
    } catch (error) {
        ElMessage.error('请求失败: ' + error.message);
        console.log(error);
    }
}

const resetPassword = async (id) => {
    try {
        await ElMessageBox.confirm('用户密码将被重置为"123456"，确定重置吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
    }
    catch (cancel) {
        // 用户点击了取消
        return;
    }
    try {
        const response = await request.put(`${API.RESETPASSWORD}/${id}`);
        if (response.code === 0) {
            ElMessage.success('密码重置成功');
        } else {
            ElMessage.error('密码重置失败');
        }
    } catch (error) {
        ElMessage.error('请求失败: ' + error.message);
        console.log(error);
    }
}

// 页面加载时获取用户列表
onMounted(() => {
    fetchUsers();
});
</script>

<style scoped>
.users-container {
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中（如果需要） */
    /* 灰色边框 */
    border-radius: 4px;
    /* 圆角 */
    padding: 1px 0;
    display: flex;
    background-color: #fff;
}

.user-table {
    width: 95%;
}

.toolbar {
    padding: 1px 0;
    text-align: right;
    margin: 1px 0;
}
</style>