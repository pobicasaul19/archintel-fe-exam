import { defineStore } from 'pinia';
import type { AuthUser, User } from "../models/User";

export const useAuthStore = defineStore('auth', {
  state: (): AuthUser => ({
    userInfo: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.userInfo && !!state.token,
    getUserInfo: (state) => state.userInfo,
    getUserById: (state) => (id: number) => state.userInfo?.id === id
  },
  actions: {
    setUserInfo(user: User) {
      this.userInfo = user;
    },
    setToken(token: string) {
      this.token = token;
    },
    logout() {
      this.userInfo = null;
      this.token = null;
    }
  },
});
