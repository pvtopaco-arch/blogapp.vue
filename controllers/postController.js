const Post = require("../models/Post");

// ADD POST
const addPost = async (req, res) => {
    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).send({
                message: "Title and content are required"
            });
        }

        const newPost = new Post({
            title,
            content,
            author: req.user.id,
            authorName: req.user.username
        });

        const savedPost = await newPost.save();

        return res.status(201).send(savedPost);

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
};


// GET ALL POSTS
const getPosts = async (req, res) => {
    try {

        const posts = await Post.find({}).sort({ createdAt: -1 });

        return res.status(200).send({
            posts: posts
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
};


// GET SPECIFIC POST
const getPost = async (req, res) => {
    try {

        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        return res.status(200).send(post);

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
};


// UPDATE POST
const updatePost = async (req, res) => {
    try {

        const { postId, title, content } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        // Only the author of the post or an admin can update it
        if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({
                message: "Access denied. You can only update your own posts."
            });
        }

        if (title !== undefined) {
            post.title = title;
        }

        if (content !== undefined) {
            post.content = content;
        }

        const updatedPost = await post.save();

        return res.status(200).send(updatedPost);

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
};


// DELETE POST
const deletePost = async (req, res) => {
    try {

        const { postId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        // The author of the post can delete their own post,
        // and an admin is allowed to delete any post
        if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({
                message: "Access denied. You can only delete your own posts."
            });
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).send({
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.error("DELETE ERROR:", error);

        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    addPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
};
