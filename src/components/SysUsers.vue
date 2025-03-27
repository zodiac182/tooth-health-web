<template>
    <el-container class="toolbar">
        <!-- 操作按钮 -->
        <el-form :model="toolbarFormData" ref="toolbarFormRef" class="toolbar-form" label-width="5rem">
            <el-row class="toolbar-row">
                <el-col :span="6" class="toolbar-col">
                    <el-form-item label="登陆名:" prop="username" class="toolbar-form-item">
                        <el-input v-model="toolbarFormData.username" placeholder="请输入用户名" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                    <el-form-item label="姓名:" prop="nickname">
                        <el-input v-model="toolbarFormData.nickname" placeholder="请输入真实姓名" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="searchUser" :icon="Search" plain>
                        查找
                    </el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="newUserDialog" :icon="CirclePlus" plain>
                        新增用户
                    </el-button>
                </el-col>
            </el-row>

        </el-form>


    </el-container>
    <el-container class="users-container">
        <el-main class="users-main">
            <!-- 用户列表 -->
            <el-table :data="usersData" class="user-table">
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
        </el-main>
        <el-footer>
            <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total=total prev-text="上一页" next-text="下一页"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-footer>
    </el-container>
    <!-- 新增用户弹窗 -->
    <el-dialog title="新增用户" v-model="newUserDiaglogVisible" width="40%" max-width="480px">
        <el-form :model="newUserData" :rules="rules" ref="newUserFormRef" label-width="80px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="newUserData.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
                <el-input v-model="newUserData.nickname" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select v-model="newUserData.role" placeholder="请选择角色">
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
        <el-form :model="editUser" :rules="editRules" ref="editUserFormRef" label-width="80px">
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


</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';
import API from '@/config/api';
import { Edit, Delete, RefreshRight, CirclePlus, Search } from '@element-plus/icons-vue';

const usersData = ref([]); // 用户列表
const newUserDiaglogVisible = ref(false); // 控制弹窗显示
const editDialogVisible = ref(false);

const newUserFormRef = ref(null); // 表单引用
const editUserFormRef = ref(null);


const toolbarFormRef = ref(null)
const toolbarFormData = reactive({
    username: "",
    nickname: "",
})

// 新增用户表单数据
const newUserData = ref({
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


// 分页设置
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取用户列表
const fetchUsers = async () => {
    try {
        const response = await request.get(API.SYSUSERS, {
            params: {
                page: currentPage.value,
                size: pageSize.value
            }
        });
        if (response.code === 0) {
            usersData.value = response.data.data;
            total.value = response.data?.total || 0;
        } else {
            ElMessage.error('获取用户列表失败');
        }
    } catch (error) {
        ElMessage.error('请求失败: ' + error.message);
    }
};

const searchUser = async () => {
    if (toolbarFormData.username.trim() !== "" || toolbarFormData.nickname.trim() !== "") {
        try {
            const response = await request.get(API.SYSUSERS, {
                params: {
                    username: toolbarFormData.username.trim(),
                    nickname: toolbarFormData.nickname.trim(),
                }
            });
            if (response.code === 0) {
                usersData.value = response.data.data;
                total.value = response.data?.total || 0;
            } else {
                ElMessage.error('获取用户列表失败');
            }
        } catch (error) {
            ElMessage.error('请求失败: ' + error.message);
        }
    } else {
        fetchUsers()
    }
}

const handleCurrentChange = () => {
    fetchUsers();
};
const handleSizeChange = () => {
    fetchUsers();
};
// 显示新增用户弹窗
const newUserDialog = () => {
    newUserData.value = { username: '', nickname: '', role: '' }; // 重置表单
    newUserDiaglogVisible.value = true;
};

// 新增用户
const addUser = () => {
    newUserFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const response = await request.post(API.SYSUSER, newUserData.value);
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
        const response = await request.put(`${API.ROLE}`, {
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
    /* 灰色边框 */
    border-radius: 4px;
    /* 圆角 */
    padding: 1px 0;
    display: flex;
    background-color: #fff;
    margin: 2px;
}

.users-main {
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中（如果需要） */
    /* 灰色边框 */
    /* 圆角 */
    padding: 1px 0;
    display: flex;
    background-color: #fff;
    width: 100%;
    margin: 2px;
}

.user-table {
    width: 95%;
}

.toolbar {
    /* padding: 1px 0; */
    /* text-align: left; */
    margin: 2px 2px;
    background-color: #fff;
}

.toolbar-form {
    width: 100%;
    margin: 2px 2px;

}

.toolbar-row {

    background-color: #fff;

}


.toolbar-col {

    align-items: center;
}

.toolbar-form-item {

    display: flex;

    background-color: #fff;
}
</style>