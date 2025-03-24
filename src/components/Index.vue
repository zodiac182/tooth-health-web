<template>
  <div class="container">
    <el-form class="user-form" :model="formData" :rules="rules" ref="formRef" label-width="6rem"
      @keydown.enter.native="submitForm">
      <el-row :gutter="1">
        <el-col :span="8">
          <el-form-item label="身份证号:" prop="idcard">
            <el-input v-model="formData.idcard" placeholder="请输入身份证号码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别:">
            <el-radio-group v-model="formData.gender" prop="gender">
              <el-radio :value=0>男</el-radio>
              <el-radio :value=1>女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="1">
        <el-col :span="8">
          <el-form-item label="学校:" prop="school">
            <el-input v-model="formData.school" placeholder="请输入学校名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班级:" prop="class">
            <el-input v-model="formData.class" placeholder="请输入班级" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话:" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入联系电话" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item>
            <!-- 牙齿图 -->
            <TeethDiagram @toothStatusChange="handleToothChange" :refresh="refreshFlag" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="1">
        <el-col>
          <el-form-item style="margin: 0; padding: 0;">
            <span>其他状况：</span>
            <el-checkbox-group v-model="formData.teethOtherStatus" size="large">
              <el-checkbox v-for="s in teethOtherStatus" :value="s.value" :label="s.value">
                {{ s.text }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="1">
        <el-col :span="8">
          <el-form-item label="检查者:" prop="checker">
            <el-input v-model="formData.checker" placeholder="请输入检查者名称" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="1" style="display: flex; justify-content: center; align-items: center; background-color: #fff;">

          <el-tooltip content="历史" placement="top">
            <el-button type="primary" @click="submitForm" :icon="Finished" plain circle>
            </el-button>
          </el-tooltip>

        </el-col>

        <el-col :span="1" style="display: flex; justify-content: center; align-items: center; background-color: #fff;">
          <el-tooltip content="刷新" placement="top">
            <el-button type="primary" @click="reset" :icon="Refresh" plain circle>
            </el-button>
          </el-tooltip>
        </el-col>

        <el-col :span="10">
          <el-form-item>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="submitForm" auto-insert-space>提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script setup>
import { ref, reactive } from 'vue';
import TeethDiagram from './TeethDiagram.vue';
import { ElMessage } from 'element-plus';
import { Finished, Refresh } from '@element-plus/icons-vue';
import request from '@/utils/request';
import API from '@/config/api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = userStore.user;

const formRef = ref(null);

const rules = {
  idcard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[0-9|X|x]$/, message: '请输入有效的身份证号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
  school: [
    { required: true, message: '请输入学校', trigger: 'blur' },
  ],
  class: [
    { required: true, message: '请输入班级', trigger: 'blur' },
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' },
  ],
  checker: [
    { required: true, message: '请输入检查者', trigger: 'blur' },
  ],
};

// 表单数据，使用 reactive 创建响应式对象
const formData = reactive({
  idcard: '',
  name: '',
  gender: 0, // 0 男 1 女
  phone: '',
  school: '',
  class: '',
  checker: user.nickname,
  teethStatus: [],
  teethOtherStatus: [],
});

// 提交后的数据

const teethOtherStatus = [
  { text: "牙齿不齐", value: 1 },
  { text: "开合", value: 2 },
  { text: "反合", value: 3 },
  { text: "唇舌系带过短", value: 4 },
  { text: "乳牙滞留", value: 5 },
  { text: "口腔黏膜异常", value: 6 }
]


const TeethData = ref([
  { id: 11, status: 0 },
  { id: 12, status: 0 },
  { id: 13, status: 0 },
  { id: 14, status: 0 },
  { id: 15, status: 0 },
  { id: 16, status: 0 },
  { id: 21, status: 0 },
  { id: 22, status: 0 },
  { id: 23, status: 0 },
  { id: 24, status: 0 },
  { id: 25, status: 0 },
  { id: 26, status: 0 },
  { id: 31, status: 0 },
  { id: 32, status: 0 },
  { id: 33, status: 0 },
  { id: 34, status: 0 },
  { id: 35, status: 0 },
  { id: 36, status: 0 },
  { id: 41, status: 0 },
  { id: 42, status: 0 },
  { id: 43, status: 0 },
  { id: 44, status: 0 },
  { id: 45, status: 0 },
  { id: 46, status: 0 },
  { id: 51, status: 0 },
  { id: 52, status: 0 },
  { id: 53, status: 0 },
  { id: 54, status: 0 },
  { id: 55, status: 0 },
  { id: 61, status: 0 },
  { id: 62, status: 0 },
  { id: 63, status: 0 },
  { id: 64, status: 0 },
  { id: 65, status: 0 },
  { id: 71, status: 0 },
  { id: 72, status: 0 },
  { id: 73, status: 0 },
  { id: 74, status: 0 },
  { id: 75, status: 0 },
  { id: 81, status: 0 },
  { id: 82, status: 0 },
  { id: 83, status: 0 },
  { id: 84, status: 0 },
  { id: 85, status: 0 },
]);

// 提交表单的函数
// 提交表单的函数
const submitForm = async () => {
  const isValid = async () => {
    return new Promise((resolve) => {
      formRef.value.validate((valid) => {
        resolve(valid);
      });
    });
  };

  const valid = await isValid();

  if (!valid) {
    ElMessage.error('请检查表单数据');
    return;
  }
  // 提交表单
  formData.teethStatus = JSON.parse(JSON.stringify(TeethData.value));
  try {
    const response = await request.post(`${API.NEWREPORT}`, formData);
    if (response.code === 0) {
      ElMessage.success(response.message);
      reset();
    } else {
      console.error(response);
      ElMessage.error('提交失败');
    }
  } catch (error) {
    ElMessage.error('请求失败，请稍后再试');
    console.error(error);
  }
};


const handleToothChange = (tooth) => {
  TeethData.value = TeethData.value.map(t =>
    t.id === tooth.id ? { ...t, status: tooth.status } : t
  );
  // formData.status = Teeth.value.map(t => t.status);
  // console.log('收到牙齿状态更新:', formData.status);
};

const refreshFlag = ref(false);

const reset = () => {
  formRef.value.resetFields()

  TeethData.value = TeethData.value.map(t => ({ ...t, status: 0 }));
  formData.teethOtherStatus = [];
  formData.teethStatus = JSON.parse(JSON.stringify(TeethData.value));

  // 刷新牙齿状态组件
  refreshFlag.value = !refreshFlag.value;
  setTimeout(() => {
    refreshFlag.value = false; // 延迟一小段时间后再恢复为false
  }, 10);
}

</script>

<style scoped>
.container {
  width: 100%;
  /* padding: 10px; */
  /* margin: 10px auto; */
}

.user-form {
  /* padding: 1rem; */
  /* background-color: #fff; */
  /* width: calc(100% - 2px); */
  margin: 1px;
}

.el-row {
  margin-bottom: 1px;
}


.el-form-item {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 50px;
  padding: 0 1rem;
  background-color: #fff;
}

.el-radio-group {
  border: 1px solid #eee;
  /* 灰色边框 */
  border-radius: 4px;
  /* 圆角 */
  padding: 0 1rem;
  /* 内边距 */

}

.el-radio-group label {
  margin: 0 1rem;
}

.teeth-svg {
  display: flex;
  width: 100%;
  align-items: center;
  /* max-width: 800px; */
}

.vertical-checkbox-group {
  display: flex;
  flex-direction: column;
  /* 竖向排列 */
}
</style>