import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import Version from '@/components/Version.vue'
import Main from '@/views/Main.vue'
import SysUsers from '@/components/SysUsers.vue'
import Index from '@/components/Index.vue'
import Settings from '@/components/Settings.vue'

import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: '#',
        component: Index,
      },
      {
        path: '/index',
        name: 'Index',
        component: Index,
      },
      {
        path: '/version',
        name: 'Version',
        component: Version,
      },
      {
        path: '/sysusers',
        name: 'SysUsers',
        component: SysUsers,
        meta: { requiresAdmin: true },
      },
      {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        meta: { requiresAdmin: true },
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = !!userStore.user; // 检查是否登录
  const isAdmin = userStore.user?.role === 'admin';

  // 如果目标路由需要登录且用户未登录
  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.warning('请先登录');
    next('/login'); // 重定向到登录页面
  }
  // 如果需要管理员权限且不是管理员
  else if (to.meta.requiresAdmin && !isAdmin) {
    ElMessage.error('无权限访问');
    next('/'); // 重定向到仪表盘首页
  }
  else {
    next(); // 继续导航
  }
});

export default router