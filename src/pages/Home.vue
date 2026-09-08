<template>
    <div class="blog-home">
        <section class="blog-hero">
            <p class="blog-eyebrow">Our blog</p>
            <h1 class="blog-heading">Resources and insights</h1>
            <p class="blog-sub">
                Posts written by people using Prendster — guides, updates, and stories.
            </p>

            <div class="blog-search">
                <i class="bi bi-search"></i>
                <input v-model="search" type="text" placeholder="Search posts..." />
            </div>

            <p class="blog-cta">
                <router-link v-if="!auth.isLoggedIn" :to="{ name: 'Register' }">
                    New here? Create an account
                </router-link>
                <router-link v-else :to="{ name: 'NewPost' }">
                    Have something to say? Write a post
                </router-link>
            </p>
        </section>

        <section class="blog-grid-section">
            <div v-if="store.loading" class="text-center py-5 blog-muted">Loading posts...</div>

            <div v-else-if="filteredPosts.length === 0" class="text-center py-5 blog-muted">
                No posts match your search yet.
            </div>

            <div v-else class="blog-grid">
                <router-link
                    v-for="(post, index) in visiblePosts"
                    :key="post._id || post.id"
                    :to="{ name: 'PostDetail', params: { id: post._id || post.id } }"
                    class="blog-card"
                >
                    <div class="blog-thumb" :class="thumbClass(index)">
                        {{ post.title ? post.title.charAt(0).toUpperCase() : "?" }}
                    </div>
                    <div class="blog-card-body">
                        <span class="blog-tag">{{ tagFor(index) }}</span>
                        <h3 class="blog-card-title">
                            {{ post.title }}
                            <i class="bi bi-arrow-up-right"></i>
                        </h3>
                        <p class="blog-card-excerpt">{{ excerpt(post.content) }}</p>
                        <div class="blog-card-author">
                            <span class="avatar-circle">{{ initials(post.authorName) }}</span>
                            <div>
                                <div class="author-name">{{ post.authorName }}</div>
                                <div class="author-date">{{ formatDate(post.createdAt) }}</div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="text-center mt-4" v-if="hasMore">
                <button class="btn-load-more" @click="loadMore">
                    <i class="bi bi-arrow-down me-1"></i> Load more
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { usePostStore } from "../stores/posts";
import { useAuthStore } from "../stores/auth";

const store = usePostStore();
const auth = useAuthStore();

const search = ref("");
const visibleCount = ref(9);

onMounted(() => {
    if (!store.loaded) store.fetchPosts();
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

const visiblePosts = computed(() => filteredPosts.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredPosts.value.length);

function loadMore() {
    visibleCount.value += 6;
}

// there's no "category" field on a post, so we just cycle through a
// few labels to give each card some visual variety, like a real blog
const tags = ["Design", "Product", "Engineering", "Community", "Tips"];
function tagFor(index) {
    return tags[index % tags.length];
}

// same idea for the thumbnail colors/icons since posts don't have cover images
const thumbStyles = ["thumb-a", "thumb-b", "thumb-c", "thumb-d"];
function thumbClass(index) {
    return thumbStyles[index % thumbStyles.length];
}

function excerpt(content) {
    if (!content) return "";
    return content.length > 90 ? content.slice(0, 90).trim() + "..." : content;
}

function initials(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
}

function formatDate(raw) {
    if (!raw) return "";
    return new Date(raw).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
</script>