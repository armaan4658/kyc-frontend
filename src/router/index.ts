import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "../components/layouts/AuthLayout.vue";
import DashboardLayout from "../components/layouts/DashboardLayout.vue";

import Login from "../components/views/Login.vue";
import Signup from "../components/views/Signup.vue";

const routes = [
  {
    path: "/",
    redirect: () => {
      const token = localStorage.getItem("token");
      return token ? "/dashboard" : "/login";
    },
  },
  {
    path: "/",
    component: AuthLayout,
    children: [
      { path: "login", component: Login },
      { path: "signup", component: Signup },
    //   { path: "reset", component: ResetPassword },
    ],
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    beforeEnter: (to: any, from: any, next: any) => {
      const token = localStorage.getItem("token");
      if (!token) {
        next("/login"); // Redirect to login if no token
      } else {
        next();
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
