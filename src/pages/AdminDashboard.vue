<template>
    <div class="container py-5">
        <div class="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
            <div>
                <div class="section-eyebrow mb-1">Admin</div>
                <h2 class="font-display" style="font-size: 2rem;">
                    Dashboard
                </h2>
            </div>
            <router-link :to="{ name: 'NewPost' }" class="btn btn-amber">
                <i class="bi bi-plus-lg me-1"></i> New post
            </router-link>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
                <div class="stat-pill">
                    <div class="num">{{ store.posts.length }}</div>
                    <div class="label">Total posts</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="stat-pill">
                    <div class="num">{{ authorCount }}</div>
                    <div class="label">Authors</div>
                </div>
            </div>
        </div>

        <div v-if="feedback" class="alert py-2 small" :class="feedback.type === 'error' ? 'alert-danger' : 'alert-success'">
            {{ feedback.text }}
        </div>

        <div v-if="store.loading" class="text-muted">Loading posts...</div>

        <div class="table-responsive" v-else-if="store.posts.length">
            <table class="table table-ink align-middle">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Published</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="post in sortedPosts" :key="post._id || post.id">
                        <td>{{ post.title }}</td>
                        <td>{{ post.authorName }}</td>
                        <td class="text-muted">{{ formatDate(post.createdAt) }}</td>
                        <td class="text-end">
                            <router-link
                                :to="{ name: 'PostDetail', params: { id: post._id || post.id } }"
                                class="btn btn-sm btn-ghost me-2"
                            >
                                <i class="bi bi-eye me-1"></i> View
                            </router-link>
                            <button
                                class="btn btn-sm btn-outline-danger"
                                @click="handleDelete(post)"
                                :disabled="deletingId === (post._id || post.id)"
                            >
                                <i class="bi bi-trash me-1"></i>
                                {{ deletingId === (post._id || post.id) ? "Deleting..." : "Delete" }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="empty-state">
            <i class="bi bi-journal-richtext fs-3 d-block mb-2"></i>
            No posts published yet.
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { usePostStore } from "../stores/posts";

const store = usePostStore();
const feedback = ref(null);
const deletingId = ref(null);

onMounted(() => {
    if (!store.loaded) store.fetchPosts();
});

const sortedPosts = computed(() =>
    [...store.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

const authorCount = computed(() => new Set(store.posts.map((p) => p.authorName).filter(Boolean)).size);

function formatDate(raw) {
    if (!raw) return "";
    return new Date(raw).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

async function handleDelete(post) {
    const id = post._id || post.id;
    if (!window.confirm(`Delete "${post.title}" by ${post.authorName}? This can't be undone.`)) return;

    deletingId.value = id;
    feedback.value = null;
    try {
        await store.deletePost(id);
        feedback.value = { type: "success", text: `"${post.title}" was deleted.` };
    } catch (err) {
        feedback.value = { type: "error", text: err.response?.data?.message || "Couldn't delete that post." };
    } finally {
        deletingId.value = null;
    }
}
</script>
