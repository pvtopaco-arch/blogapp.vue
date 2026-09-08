<template>
    <div class="auth-shell">
        <div class="text-muted">Logging out...</div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
    auth.logout();
    router.replace({ name: "Home" });
});
</script>
