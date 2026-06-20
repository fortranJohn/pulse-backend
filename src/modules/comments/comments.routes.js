const express = require("express")
const { handleCreateComment, handleLikeComment, handleUnlikeComment, handleGetCommentsForPost, handleCreateReply } = require("./comments.controller")
const authenticate = require("../../middleware/auth.middleware")


const router = express.Router()


router.post("/:postId", authenticate, handleCreateComment)
router.post("/:commentId/like", authenticate, handleLikeComment)
router.delete("/:commentId/unlike", authenticate, handleUnlikeComment )
router.post("/:commentId/reply", authenticate, handleCreateReply) 
router.get("/post/:postId", authenticate, handleGetCommentsForPost)

module.exports = router