<template>
    <div class="card-post">
        <div class="card-body-post">
            <div class="card-title-post">{{ post.title }}</div>
            <p class="card-excerpt">{{ excerpt }}</p>
            <div class="card-meta">
                <span class="author-chip">
                    <i class="bi bi-person-circle"></i> {{ post.authorName || "Unknown" }}
                </span>
                <span>{{ formattedDate }}</span>
            </div>
            <router-link
                :to="{ name: 'PostDetail', params: { id: post._id || post.id } }"
                class="btn btn-outline-amber btn-sm mt-3"
            >
                Read post
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});

const excerpt = computed(() => {
    const text = props.post.content || "";
    return text.length > 140 ? text.slice(0, 140).trim() + "…" : text;
});

const formattedDate = computed(() => {
    const raw = props.post.createdAt;
    if (!raw) return "";
    return new Date(raw).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
});
</script>
