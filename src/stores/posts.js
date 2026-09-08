import { defineStore } from "pinia";
import api from "../api";

export const usePostStore = defineStore("posts", {
    state: () => ({
        posts: [],
        loading: false,
        loaded: false
    }),
    getters: {
        getById: (state) => (id) => state.posts.find((p) => (p._id || p.id) === id)
    },
    actions: {
        async fetchPosts({ force = false } = {}) {
            if (this.loaded && !force) return;
            this.loading = true;
            try {
                const res = await api.get("/posts/getPosts");
                this.posts = res.data?.posts || res.data || [];
                this.loaded = true;
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async fetchPost(postId) {
            const res = await api.get(`/posts/getPost/${postId}`);
            const post = res.data?.post || res.data;
            const idx = this.posts.findIndex((p) => (p._id || p.id) === postId);
            if (idx !== -1) {
                this.posts[idx] = post;
            } else if (post) {
                this.posts.push(post);
            }
            return post;
        },
        async addPost(post) {
            const res = await api.post("/posts/addPost", post);
            const created = res.data?.post || res.data;
            if (created && typeof created === "object") {
                this.posts.unshift(created);
            } else {
                await this.fetchPosts({ force: true });
            }
            return created;
        },
        async updatePost(postId, updates) {
            const res = await api.patch("/posts/updatePost", { postId, ...updates });
            const updated = res.data?.post || res.data;
            if (updated && typeof updated === "object") {
                const idx = this.posts.findIndex((p) => (p._id || p.id) === postId);
                if (idx !== -1) this.posts[idx] = updated;
            } else {
                await this.fetchPosts({ force: true });
            }
            return updated;
        },
        async deletePost(postId) {
            await api.delete("/posts/deletePost", { data: { postId } });
            this.posts = this.posts.filter((p) => (p._id || p.id) !== postId);
        }
    }
});
