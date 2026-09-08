<template>
    <div class="container py-5" style="max-width: 720px;">
        <router-link :to="backLink" class="d-inline-flex align-items-center gap-1 mb-4 text-muted">
            <i class="bi bi-arrow-left"></i> Back
        </router-link>

        <h2 class="font-display mb-4" style="font-size: 1.9rem;">
            {{ isEditing ? "Edit post" : "Write a new post" }}
        </h2>

        <div v-if="loadingPost" class="text-muted">Loading post...</div>

        <form v-else @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label text-muted small">Title</label>
                <input v-model="form.title" class="form-control form-control-ink" required />
            </div>
            <div class="mb-3">
                <label class="form-label text-muted small">Content</label>
                <textarea v-model="form.content" class="form-control form-control-ink" rows="10" required></textarea>
            </div>

            <div class="alert alert-danger py-2 small" v-if="error">{{ error }}</div>

            <div class="d-flex justify-content-end gap-2">
                <router-link :to="backLink" class="btn btn-ghost">Cancel</router-link>
                <button type="submit" class="btn btn-amber" :disabled="submitting">
                    {{ submitting ? "Saving..." : (isEditing ? "Save changes" : "Publish post") }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { usePostStore } from "../stores/posts";

const props = defineProps({
    id: {
        type: String,
        default: null
    }
});

const store = usePostStore();
const router = useRouter();

const isEditing = computed(() => !!props.id);
const backLink = computed(() =>
    isEditing.value ? { name: "PostDetail", params: { id: props.id } } : { name: "Posts" }
);

const loadingPost = ref(isEditing.value);
const submitting = ref(false);
const error = ref("");

const form = reactive({
    title: "",
    content: ""
});

onMounted(async () => {
    if (!isEditing.value) return;

    if (!store.loaded) {
        try {
            await store.fetchPosts();
        } catch (err) {
            // ignore, we'll try fetching the single post below
        }
    }

    let existing = store.getById(props.id);
    if (!existing) {
        existing = await store.fetchPost(props.id).catch(() => null);
    }

    if (existing) {
        form.title = existing.title || "";
        form.content = existing.content || "";
    }

    loadingPost.value = false;
});

async function handleSubmit() {
    error.value = "";
    submitting.value = true;
    try {
        if (isEditing.value) {
            await store.updatePost(props.id, { ...form });
            router.push({ name: "PostDetail", params: { id: props.id } });
        } else {
            const created = await store.addPost({ ...form });
            router.push({ name: "PostDetail", params: { id: created._id || created.id } });
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Couldn't save that post. Please try again.";
    } finally {
        submitting.value = false;
    }
}
</script>
