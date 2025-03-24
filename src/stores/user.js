import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null); // 用户信息

  // 保存用户信息
  function setUser(userInfo) {
    user.value = userInfo;
  }

  // 清除用户信息（登出时使用）
  function clearUser() {
    user.value = null;
  }

  return { user, setUser, clearUser }
}, {
  persist: true, // 启用持久化，保存到 localStorage
});