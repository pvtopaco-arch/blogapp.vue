<template>
    <div class="container py-5" style="max-width: 860px;">
        <router-link :to="{ name: 'Posts' }" class="d-inline-flex align-items-center gap-1 mb-4 text-muted">
            <i class="bi bi-arrow-left"></i> Back to all posts
        </router-link>

        <div v-if="loading" class="text-muted">Loading...</div>

        <div v-else-if="!post" class="empty-state">
            <i class="bi bi-question-circle fs-3 d-block mb-2"></i>
            We couldn't find that post.
        </div>

        <div v-else class="detail-shell">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                    <span class="author-chip mb-2 d-inline-flex">
                        <i class="bi bi-person-circle"></i> {{ post.authorName }}
                    </span>
                    <h1 class="detail-title">{{ post.title }}</h1>
                </div>
                <div class="detail-meta text-end">
                    <div>{{ formattedDate }}</div>
                </div>
            </div>

            <p class="detail-body mt-4">{{ post.content }}</p>

            <div v-if="canManage" class="d-flex gap-2 mt-4 pt-3" style="border-top: 1px solid var(--line);">
                <router-link :to="{ name: 'EditPost', params: { id: post._id || post.id } }" class="btn btn-ghost btn-sm">
                    <i class="bi bi-pencil me-1"></i> Edit
                </router-link>
                <button class="btn btn-outline-danger btn-sm" @click="handleDelete" :disabled="deleting">
                    <i class="bi bi-trash me-1"></i> {{ deleting ? "Deleting..." : "Delete" }}
                </button>
            </div>

            <div v-if="feedback" class="alert py-2 small mt-3" :class="feedback.type === 'error' ? 'alert-danger' : 'alert-success'">
                {{ feedback.text }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { usePostStore } from "../stores/posts";
import { useAuthStore } from "../stores/auth";

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const store = usePostStore();
const auth = useAuthStore();
const router = useRouter();

const loading = ref(true);
const deleting = ref(false);
const feedback = ref(null);

const post = computed(() => store.getById(props.id));

onMounted(async () => {
    if (!store.loaded) {
        try {
            await store.fetchPosts();
        } catch (err) {
            // fall through, we'll try fetching this single post next
        }
    }
    if (!post.value) {
        try {
            await store.fetchPost(props.id);
        } catch (err) {
            // post genuinely doesn't exist, template handles the empty state
        }
    }
    loading.value = false;
});

const canManage = computed(() => {
    if (!post.value || !auth.isLoggedIn) return false;
    const authorId = post.value.author?._id || post.value.author;
    return authorId === auth.user.id || auth.isAdmin;
});

const formattedDate = computed(() => {
    if (!post.value?.createdAt) return "";
    return new Date(post.value.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
});

async function handleDelete() {
    if (!window.confirm(`Delete "${post.value.title}"? This can't be undone.`)) return;

    deleting.value = true;
    feedback.value = null;
    try {
        await store.deletePost(post.value._id || post.value.id);
        router.push({ name: "Posts" });
    } catch (err) {
        feedback.value = { type: "error", text: err.response?.data?.message || "Couldn't delete that post." };
        deleting.value = false;
    }
}
</script>
