const express = require("express");
const postController = require("../controllers/postController");
const { verify } = require("../auth");
const router = express.Router();

// ADD POST
router.post(
    "/addPost",
    verify,
    postController.addPost
);

// GET ALL POSTS
router.get(
    "/getPosts",
    postController.getPosts
);

// GET SPECIFIC POST
router.get(
    "/getPost/:postId",
    postController.getPost
);

// UPDATE POST
router.patch(
    "/updatePost",
    verify,
    postController.updatePost
);

// DELETE POST
router.delete(
    "/deletePost",
    verify,
    postController.deletePost
);

module.exports = router;