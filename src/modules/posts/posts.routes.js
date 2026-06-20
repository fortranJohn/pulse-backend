const express = require("express")
const authenticate = require("../../middleware/auth.middleware")
const { handleCreatePost } = require("./posts.controller")
const router = express.Router()



router.post("/", authenticate, handleCreatePost)
// router.get("/:postId/comments", authenticate, handleGetCommentsForPost)

module.exports = router