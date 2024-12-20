import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "../components/layouts/AuthLayout.vue";
import DashboardLayout from "../components/layouts/DashboardLayout.vue";

import Login from "../components/views/Login.vue";
// import Signup from "@/components/Signup.vue";
// import ResetPassword from "@/components/ResetPassword.vue";
// import Dashboard from "@/components/Dashboard.vue";
// import KYC from "@/components/KYC.vue";
// import Users from "@/components/Users.vue";

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
    //   { path: "signup", component: Signup },
    //   { path: "reset", component: ResetPassword },
    ],
  },
//   {
//     path: "/",
//     component: DashboardLayout,
//     beforeEnter: (to, from, next) => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         next("/login"); // Redirect to login if no token
//       } else {
//         next();
//       }
//     },
//     children: [
//       { path: "dashboard", component: Dashboard },
//       { path: "kyc", component: KYC },
//       { path: "users", component: Users },
//     ],
//   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
