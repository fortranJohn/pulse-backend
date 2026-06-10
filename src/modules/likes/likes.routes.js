const express = require("express")
const router = express.Router()
const authenticate = require("../../middleware/auth.middleware")
const { handleLikePost, handleUnlikePost, handleLikeComment } = require("./likes.controller")



router.post("/:postId", authenticate, handleLikePost)
router.delete("/:postId", authenticate, handleUnlikePost)

module.exports = router