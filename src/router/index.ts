import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const routes = [
  {
    path: "/account/login",
    name: "\u2015 Log-in",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/",
    name: "\u2015 Dashboard",
    component: () => import(/* webpackChunkName: "dashboard" */ "../views/HomeView.vue"),
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/all-media",
    name: "\u2015 All Media",
    component: () => import(/* webpackChunkName: "dashboard" */ "../views/AllMediaView.vue"),
    meta: {
      authRequired: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = 'Writer/Editor Dashboard' + String(to.name);
  const authRequired = to.matched.some((route) => route.meta.authRequired);
  if (!authRequired) return next()
  useAuthStore().isAuthenticated ? next() : next('/account/login')
});

export default router