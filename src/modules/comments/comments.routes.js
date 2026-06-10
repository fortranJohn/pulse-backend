const express = require("express")
const { handleCreateComment, handleLikeComment, handleUnlikeComment } = require("./comments.controller")
const authenticate = require("../../middleware/auth.middleware")


const router = express.Router()


router.post("/:postId", authenticate, handleCreateComment)
router.post("/:commentId/like", authenticate, handleLikeComment)
router.delete("/:commentId/unlike", authenticate, handleUnlikeComment )


module.exports = router