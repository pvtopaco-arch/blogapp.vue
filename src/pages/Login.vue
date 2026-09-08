<template>
    <div class="auth-shell">
        <div class="auth-card">
            <h1>Welcome back</h1>
            <p class="text-muted mb-4">Log in to read and write posts.</p>

            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label class="form-label text-muted small">Email</label>
                    <input v-model="email" type="email" class="form-control form-control-ink" required />
                </div>
                <div class="mb-3">
                    <label class="form-label text-muted small">Password</label>
                    <input v-model="password" type="password" class="form-control form-control-ink" required />
                </div>

                <div class="alert alert-danger py-2 small" v-if="error">{{ error }}</div>

                <button type="submit" class="btn btn-amber w-100 mt-2" :disabled="loading">
                    {{ loading ? "Logging in..." : "Log in" }}
                </button>
            </form>

            <p class="text-muted small mt-4 mb-0">
                No account yet? <router-link :to="{ name: 'Register' }">Sign up</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function handleSubmit() {
    error.value = "";
    loading.value = true;
    try {
        await auth.login({ email: email.value, password: password.value });
        router.push(route.query.redirect || { name: "Posts" });
    } catch (err) {
        error.value = err.response?.data?.message || "Couldn't log in. Check your email and password.";
    } finally {
        loading.value = false;
    }
}
</script>
