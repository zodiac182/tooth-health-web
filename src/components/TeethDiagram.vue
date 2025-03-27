<template>
  <div style="width:100%">
    <svg viewBox="0 0 720 360" class="teeth-svg">
      <!-- 画横线 -->
      <line x1="20" y1="180" x2="560" y2="180" stroke="#666" stroke-width="4" />
      <!-- 画竖线 -->
      <line x1="293" y1="20" x2="293" y2="340" stroke="#666" stroke-width="4" />

      <!-- 画牙齿 -->
      <g v-for="tooth in teethData" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" stroke="black"
          :fill="getToothColor(tooth.status)" :data-tooth-id="tooth.id" :data-status="tooth.status" stroke-width="2"
          @click="toothClick(tooth)" />
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">
          {{ tooth.id }}
        </text>
      </g>


      <!-- 图例 -->
      <g v-for="(item, index) in statusColors" :key="item.value">
        <rect :x="600" :y="50 + index * 30" width="20" height="20" :fill="item.color" stroke="black" stroke-width="1" />
        <text :x="630" :y="65 + index * 30" font-size="16" fill="black">{{ item.label }}</text>
      </g>
    </svg>
  </div>

  <!-- 弹出牙齿状态对话框 -->
  <el-dialog v-model="dialogVisible" style="width:20rem">
    <h3>牙齿编号: {{ selectedTooth?.id }}</h3>
    <el-divider />
    <p>
      <el-select v-model="selectedTooth.status" placeholder="请选择状态" @change="toothStatusChange">
        <el-option label="无龋" :value=0 />
        <el-option label="有龋" :value=1 />
        <el-option label="已填充有龋" :value=2 />
        <el-option label="已填充无龋" :value=3 />
        <el-option label="因龋缺失" :value=4 />
      </el-select>
    </p>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue';
const dialogVisible = ref(false);
const selectedTooth = ref(0);


// 通用的牙齿数据生成函数
const createTeeth = (startId, count, baseX, xStep, y, isLeft = true) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    x: baseX + (isLeft ? -i * xStep : i * xStep), // 左边递减，右边递增
    y,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }));
};

// 定义所有牙齿数据
const teethGroups = [
  // 上排左侧恒牙 11-16
  { startId: 11, count: 6, baseX: 250, xStep: 40, y: 110, isLeft: true },
  // 上排左侧乳牙 51-55
  { startId: 51, count: 5, baseX: 250, xStep: 40, y: 50, isLeft: true },
  // 上排右侧恒牙 21-26
  { startId: 21, count: 6, baseX: 301, xStep: 40, y: 110, isLeft: false },
  // 上排右侧乳牙 61-65
  { startId: 61, count: 5, baseX: 301, xStep: 40, y: 50, isLeft: false },
  // 下排左侧恒牙 41-46
  { startId: 41, count: 6, baseX: 250, xStep: 40, y: 200, isLeft: true },
  // 下排左侧乳牙 81-85
  { startId: 81, count: 5, baseX: 250, xStep: 40, y: 260, isLeft: true },
  // 下排右侧恒牙 31-36
  { startId: 31, count: 6, baseX: 301, xStep: 40, y: 200, isLeft: false },
  // 下排右侧乳牙 71-75
  { startId: 71, count: 5, baseX: 301, xStep: 40, y: 260, isLeft: false },
];

// 生成所有牙齿数据并展平为一个数组
const teethData = ref(
  teethGroups
    .map(group => createTeeth(group.startId, group.count, group.baseX, group.xStep, group.y, group.isLeft))
    .flat()
  // .map(item => ({
  //   id: item.id,
  //   status: item.status
  // })) // 如果只需要 id 和 status
);

// 点击牙齿，弹出设置框
const toothClick = (tooth) => {
  selectedTooth.value = tooth;
  dialogVisible.value = true;
};

// 牙齿颜色说明
const statusColors = [
  { label: "无龋", value: 0, color: "white" },
  { label: "有龋", value: 1, color: "red" },
  { label: "已填充有龋", value: 2, color: "orange" },
  { label: "已填充无龋", value: 3, color: "green" },
  { label: "因龋缺失", value: 4, color: "gray" },
];
// 获取牙齿的状态
const getToothColor = (status) => {
  switch (status) {
    case 0:
      return "white"; // 无龋
    case 1:
      return "red"; // 有龋
    case 2:
      return "orange"; // 已填充有龋
    case 3:
      return "green"; // 已填充无龋
    case 4:
      return "gray"; // 因龋缺失
    default:
      return "white"; // 默认颜色
  }
};

// 点击确定按钮，更新牙齿状态
const toothStatusChange = () => {
  // emit("toothStatusChange", selectedTooth.value);
  setTimeout(() => {
    dialogVisible.value = false; // 延迟关闭对话框
  }, 100);
};

const reset = () => {
  resetTeethStatus();
};

// 重置所有牙齿的状态
const resetTeethStatus = () => {
  const resetStatus = 0; // 默认无龋
  for (let tooth = 0; tooth < teethData.value.length; tooth++) {
    teethData.value[tooth].status = resetStatus;
  }
};

// 获取牙齿数据
const getTeethData = () => teethData.value.map(t => ({ id: t.id, status: t.status }))

// 设置牙齿数据
const setTeethData = (data) => {
  for (let group = 0; group < teethData.value.length; group++) {
    for (let tooth = 0; tooth < teethData.value[group].length; tooth++) {
      const id = teethData.value[group][tooth].id;
      const status = data.find(t => t.id === id)?.status || 0;
      teethData.value[group][tooth].status = status;
    }
  }
}

defineExpose({
  reset,
  getTeethData
})

</script>

<style scoped>
.teeth-svg {
  max-height: 600px;
  height: calc(100vh/2);
  min-height: 360px;
  border: 1px solid #ddd;
  background-color: rgba(239, 222, 201, 0.1);
  /* width: 60%; */
  /* background-color:darkred; */
}
</style>