<template>
  <div class="container">
    <!-- 用户form -->
    <el-form class="user-form" :model="userData" :rules="userRules" ref="userFormRef"
      @keyup.enter.native="submitForm(force)" label-width="6rem">
      <!-- @keydown.enter.native="submitForm(false)" -->
      <el-row :gutter="1">
        <el-col :span="8">
          <el-form-item label="身份证号:" ref="idCard" prop="idCard">
            <el-input v-model="userData.idCard" placeholder="请输入身份证号码" @keyup.enter.native.stop="searchUser"
              clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名:" ref="name" prop="name">
            <el-input v-model="userData.name" placeholder="请输入姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别:">
            <el-radio-group v-model="userData.gender" ref="gender" prop="gender">
              <el-radio :value=0>男</el-radio>
              <el-radio :value=1>女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="1">
        <el-col :span="8">
          <el-form-item label="学校:" ref="school" prop="school">
            <el-input v-model="userData.school" placeholder="请输入学校名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班级:" prop="class">
            <el-input v-model="userData.class" placeholder="请输入班级" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话:" prop="phone">
            <el-input v-model="userData.phone" placeholder="请输入联系电话" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- examine form -->
    <el-form class="examine-form" :model="examineData" ref="examineFormRef" label-width="6rem">
      <el-row>
        <el-col>
          <el-form-item>
            <!-- 牙齿图 -->
            <TeethDiagram ref="teethDiagramRef" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="1">
        <el-col>
          <el-form-item style="margin: 0; padding: 0;" label="其他状况：" prop="teethExtraData">
            <el-checkbox-group v-model="examineData.teethExtraData" size="large">
              <el-checkbox v-for="s in teethExtraStatus" :value="s.value" :label="s.value">
                {{ s.text }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="1">
        <el-col :span="8">
          <el-form-item label="检查者:" prop="examiner">
            <el-input v-model="examineData.examiner" placeholder="请输入检查者名称" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="1" style="display: flex; justify-content: center; align-items: center; background-color: #fff;">

          <el-tooltip content="历史" placement="top">
            <el-button type="primary" @click="getExamineHistory" :icon="Finished" plain circle>
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
            <el-button type="primary" @click="submitForm(false)" auto-insert-space>提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script setup>
import { ref, reactive } from 'vue';
import TeethDiagram from './TeethDiagram.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Finished, Refresh } from '@element-plus/icons-vue';
import request from '@/utils/request';
import API from '@/config/api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = userStore.user;

const userFormRef = ref(null);
const examineFormRef = ref(null);
const teethDiagramRef = ref(null);

// 表单数据，使用 reactive 创建响应式对象
const userData = reactive({
  idCard: '',
  name: '',
  gender: 0, // 0 男 1 女
  phone: '',
  school: '',
  class: '',
});

const examineData = reactive({
  userId: 0,
  recordId: 0,
  examiner: user.nickname,
  teethData: [],
  teethExtraData: [],
  force: false,
});

const userRules = {
  idCard: [
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
};



// 其他牙齿状态的状态定义
const teethExtraStatus = [
  { text: "牙齿不齐", value: 1 },
  { text: "开合", value: 2 },
  { text: "反合", value: 3 },
  { text: "唇舌系带过短", value: 4 },
  { text: "乳牙滞留", value: 5 },
  { text: "口腔黏膜异常", value: 6 }
];



// 提交表单的函数
// 提交表单的函数
const submitForm = async (force) => {
  try {
    await userFormRef.value.validate();
  } catch {
    return;
  }
  // 提交表单
  // userData.teethStatus = JSON.parse(JSON.stringify(TeethStatuses.value));
  try {
    // 处理用户信息
    const response = await request.post(`${API.CUSER}`, userData);
    if (response.code === 0) {
      // 处理成功，获取ID
      examineData.userId = response.data.ID;
    } else {
      ElMessage.error(response.message);
      return;
    }

    // 处理牙齿数据
    examineData.force = force
    examineData.teethData = teethDiagramRef.value.getTeethData();
    const examineResponse = await request.post(`${API.RECORD}`, examineData);
    // 处理成功
    if (examineResponse.code === 0) {
      ElMessage.success(examineResponse.message);
      reset(); // 重置页面数据
    } else if (examineResponse.code === 7) {
      // 已存在
      try {
        await ElMessageBox.confirm('用户当日已有报告，是否继续提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        submitForm(true)
      } catch {
        // 点击了取消
        ElMessage.error('当前已有报告！提交失败');
      }
    } else {
      console.error(response);
      ElMessage.error('提交失败');
    }
  } catch (error) {
    ElMessage.error('请求失败，请稍后再试');
    console.error(error);
  }
};

// 在身份证号号下敲回车，查找用户
const searchUser = async () => {
  try {
    await userFormRef.value.validateField('idCard');

    const response = await request.get(`${API.CUSER}`, {
      params: {
        idCard: userData.idCard
      }
    });
    if (response.code == 0) {
      Object.assign(userData, response.data)
    } else {
      console.log(response)
      ElMessage.error(response.message)
    }
  } catch {
    return;
  }
}

// 重置页面数据
const reset = () => {
  // reset人员数据
  userFormRef.value.resetFields();
  // reset牙齿图
  teethDiagramRef.value.reset();

  // reset 附加状态
  examineFormRef.value.resetFields();
  // examineData.teethExtraData = [];

};

// 获取历史检查记录
const getExamineHistory = () => {
  console.log(teethDiagramRef.value.getTeethData())
};

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