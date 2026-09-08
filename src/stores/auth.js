import { defineStore } from "pinia";
import api from "../api";
import { decodeToken } from "../utils/jwt";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token") || "",
        user: decodeToken(localStorage.getItem("token") || "") || {}
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => !!state.user?.isAdmin,
        username: (state) => state.user?.username || ""
    },
    actions: {
        setToken(token) {
            this.token = token;
            this.user = decodeToken(token) || {};
            localStorage.setItem("token", token);
        },
        async register({ email, username, password }) {
            await api.post("/users/register", { email, username, password });
        },
        async login({ email, password }) {
            const res = await api.post("/users/login", { email, password });
            const token = res.data?.access || res.data?.token;

            if (!token) {
                throw new Error("Login did not return an access token.");
            }

            this.setToken(token);
        },
        logout() {
            this.user = {};
            this.token = "";
            localStorage.removeItem("token");
        }
    }
});
