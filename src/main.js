import { createApp } from 'vue'
import { createPinia } from 'pinia'; // 导入 Pinia
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // 导入 Pinia 插件


const app = createApp(App)
app.use(ElementPlus)

// Pinia用于状态管理，piniaPluginPersistedstate用于持久化状态
// 用于存储用户登录状态和信息
const pinia = createPinia(); // 创建 Pinia 实例
pinia.use(piniaPluginPersistedstate); // 安装 Pinia 插件
app.use(pinia); // 安装 Pinia

app.use(router)
app.mount('#app')
