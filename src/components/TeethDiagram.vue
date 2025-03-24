<template>
  <div style="width:100%">
    <svg viewBox="0 0 720 360" class="teeth-svg">
      <!-- 画横线 -->
      <line x1="20" y1="180" x2="560" y2="180" stroke="#666" stroke-width="4" />
      <!-- 画竖线 -->
      <line x1="293" y1="20" x2="293" y2="340" stroke="#666" stroke-width="4" />
      <!-- 上排左侧乳牙 -->
      <g v-for="tooth in upperLeftPrimaryTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="getToothColor(tooth.status)"
          stroke="black" stroke-width="2" @click="selectTooth(tooth)">
        </rect>
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
      </g>

      <!-- 上排左侧恒牙 -->
      <g v-for="tooth in upperLeftPermanentTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="getToothColor(tooth.status)"
          stroke="black" stroke-width="2" @click="selectTooth(tooth)" />
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
      </g>

      <!-- 上排右侧乳牙 -->
      <g v-for="tooth in upperRightPrimaryTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="getToothColor(tooth.status)"
          stroke="black" stroke-width="2" @click="selectTooth(tooth)">
        </rect>
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
      </g>

      <!-- 上排右侧恒牙 -->
      <g v-for="tooth in upperRightPermanentTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="getToothColor(tooth.status)"
          stroke="black" stroke-width="2" @click="selectTooth(tooth)" />
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
      </g>

      <!-- 下排左侧乳牙 -->
      <g v-for="tooth in lowerLeftPrimaryTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="getToothColor(tooth.status)"
          stroke="black" stroke-width="2" @click="selectTooth(tooth)">
        </rect>
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
      </g>

      <!-- 下排左侧恒牙 -->
      <g v-for="tooth in lowerLeftPermanentTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="getToothColor(tooth.status)"
          stroke="black" stroke-width="2" @click="selectTooth(tooth)" />
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
      </g>


      <!-- 下排右侧乳牙 -->
      <g v-for="tooth in lowerRightPrimaryTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="tooth.color" stroke="black"
          stroke-width="2" @click="selectTooth(tooth)">
        </rect>
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
      </g>

      <!-- 上排右侧恒牙 -->
      <g v-for="tooth in lowerRightPermanentTeeth" :key="tooth.id">
        <rect :x="tooth.x" :y="tooth.y" :width="tooth.width" :height="tooth.height" :fill="getToothColor(tooth.status)"
          stroke="black" stroke-width="2" @click="selectTooth(tooth)" />
        <text :x="tooth.x + 7" :y="tooth.y + 30" font-size="16" fill="black" pointer-events="none">{{ tooth.id
        }}</text>
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
const emit = defineEmits(["toothStatusChange"]);

// 牙齿数据
// 分界线：
// 左侧 x 250 // 右侧： x 300

// 上侧
// 下侧
// 上排左侧乳牙 编号51-55
const upperLeftPrimaryTeeth = ref(
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 51,
    x: 250 - i * 40,
    y: 50,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);

// 上排左侧恒牙 编号11-16
const upperLeftPermanentTeeth = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 11,
    x: 250 - i * 40,
    y: 110,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);

// 上排右侧恒牙 编号21-26
const upperRightPermanentTeeth = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 21,
    x: 301 + i * 40,
    y: 110,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);

// 上排右侧乳牙 编号61-65
const upperRightPrimaryTeeth = ref(
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 61,
    x: 301 + i * 40,
    y: 50,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);


// 下排左侧恒牙 编号41-46
const lowerLeftPermanentTeeth = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 41,
    x: 250 - i * 40,
    y: 200,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);


// 下排左侧乳牙 编号81-85
const lowerLeftPrimaryTeeth = ref(
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 81,
    x: 250 - i * 40,
    y: 260,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);



// 下排右侧恒牙 编号31-36
const lowerRightPermanentTeeth = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 31,
    x: 301 + i * 40,
    y: 200,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);
// 下排右侧乳牙 编号71-75
const lowerRightPrimaryTeeth = ref(
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 71,
    x: 301 + i * 40,
    y: 260,
    width: 35,
    height: 50,
    color: "white",
    status: 0,
  }))
);

// 牙齿颜色说明
const statusColors = [
  { label: "无龋", value: 0, color: "white" },
  { label: "有龋", value: 1, color: "red" },
  { label: "已填充有龋", value: 2, color: "orange" },
  { label: "已填充无龋", value: 3, color: "green" },
  { label: "因龋缺失", value: 4, color: "gray" },
];

const selectTooth = (tooth) => {
  selectedTooth.value = tooth;
  dialogVisible.value = true;
};

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

const toothStatusChange = () => {
  emit("toothStatusChange", selectedTooth.value);
  setTimeout(() => {
    dialogVisible.value = false; // 延迟关闭对话框
  }, 100);
};

const props = defineProps({
  refresh: Boolean,
});

const resetTeethStatus = () => {
  // 重置所有牙齿的状态
  const resetStatus = 0; // 默认无龋
  upperLeftPrimaryTeeth.value.forEach(tooth => tooth.status = resetStatus);
  upperLeftPermanentTeeth.value.forEach(tooth => tooth.status = resetStatus);
  upperRightPrimaryTeeth.value.forEach(tooth => tooth.status = resetStatus);
  upperRightPermanentTeeth.value.forEach(tooth => tooth.status = resetStatus);
  lowerLeftPrimaryTeeth.value.forEach(tooth => tooth.status = resetStatus);
  lowerLeftPermanentTeeth.value.forEach(tooth => tooth.status = resetStatus);
  lowerRightPrimaryTeeth.value.forEach(tooth => tooth.status = resetStatus);
  lowerRightPermanentTeeth.value.forEach(tooth => tooth.status = resetStatus);
};

// 监听刷新标志，当refresh变化时执行更新逻辑
watch(() => props.refresh, (newVal) => {
  if (newVal) {
    resetTeethStatus(); // 你可以在这里添加重置牙齿状态的逻辑
  }
});

</script>

<style scoped>
.teeth-svg {
  max-height: 480px;
  height: calc(100vh/2);
  min-height: 360px;
  border: 1px solid #ddd;
  /* width: 60%; */
  /* background-color:darkred; */
}
</style>