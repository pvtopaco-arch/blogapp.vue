<template>
    <div class="container py-5">
        <div class="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
            <div>
                <div class="section-eyebrow mb-1">The feed</div>
                <h2 class="font-display" style="font-size: 2rem;">
                    All posts
                </h2>
            </div>
            <input
                v-model="search"
                type="text"
                class="form-control form-control-ink"
                style="max-width: 280px;"
                placeholder="Search by title or author..."
            />
        </div>
        <div v-if="store.loading" class="text-muted">Loading posts...</div>
        <div v-else-if="loadError" class="empty-state">
            <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
            Couldn't load the feed right now. {{ loadError }}
            <div class="mt-3">
                <button class="btn btn-outline-amber btn-sm" @click="load">Try again</button>
            </div>
        </div>
        <div v-else-if="filteredPosts.length === 0" class="empty-state">
            <i class="bi bi-journal-richtext fs-3 d-block mb-2"></i>
            No posts match your search yet.
        </div>
        <div v-else class="row g-4">
            <div class="col-md-6 col-lg-4" v-for="post in filteredPosts" :key="post._id || post.id">
                <PostCard :post="post" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { usePostStore } from "../stores/posts";
import PostCard from "../components/PostCard.vue";
const store = usePostStore();
const search = ref("");
const loadError = ref("");
async function load() {
    loadError.value = "";
    try {
        await store.fetchPosts({ force: true });
    } catch (err) {
        loadError.value = err.response?.data?.message || "Please try again in a moment.";
    }
}
onMounted(() => {
    if (!store.loaded) load();
});
const filteredPosts = computed(() => {
    const term = search.value.trim().toLowerCase();
    if (!term) return store.posts;
    return store.posts.filter(
        (p) =>
            p.title?.toLowerCase().includes(term) ||
            p.authorName?.toLowerCase().includes(term)
    );
});
</script>
