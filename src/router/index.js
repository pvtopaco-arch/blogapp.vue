import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Home from "../pages/Home.vue";
import Posts from "../pages/Posts.vue";
import PostDetail from "../pages/PostDetail.vue";
import PostEditor from "../pages/PostEditor.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Logout from "../pages/Logout.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "Home", component: Home },
        { path: "/posts", name: "Posts", component: Posts, meta: { requiresAuth: true } },
        { path: "/posts/new", name: "NewPost", component: PostEditor, meta: { requiresAuth: true } },
        { path: "/posts/:id", name: "PostDetail", component: PostDetail, meta: { requiresAuth: true }, props: true },
        { path: "/posts/:id/edit", name: "EditPost", component: PostEditor, meta: { requiresAuth: true }, props: true },
        { path: "/login", name: "Login", component: Login },
        { path: "/register", name: "Register", component: Register },
        { path: "/logout", name: "Logout", component: Logout },
        { path: "/admin", name: "Admin", component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } }
    ]
});

router.beforeEach((to) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return { name: "Login", query: { redirect: to.fullPath } };
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
        return { name: "Posts" };
    }
});

export default router;
