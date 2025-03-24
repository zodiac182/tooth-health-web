<template>
    <div>
        <div>
            <span>{{ version }}</span>
        </div>
        <el-button type="default" @click="handleClick">
            测试version接口
        </el-button>
    </div>

</template>
<script setup>
import request from "@/utils/request"
import { ref, onMounted } from "vue"
import { API, BASE_URL } from "@/config/api"
import { ElMessage } from "element-plus"

const version = ref('')

const handleClick = async () => {
    try {
        const res = await request.get(API.VERSION)
        ElMessage.success(res.message);
    } catch (error) {
        // ElMessage.error(error.message);
        console.log(error)
    }
}

onMounted(async () => {
    try {
        const res = await request.get(API.VERSION)
        version.value = res.message
    } catch (error) {
        console.log(error)
    }
})
</script>