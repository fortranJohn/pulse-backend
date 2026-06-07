const express = require("express")
const { handleCreateComment } = require("./comments.controller")
const authenticate = require("../../middleware/auth.middleware")

const router = express.Router()


router.post("/:postId", authenticate, handleCreateComment)

module.exports = router