const { createComment } = require("./comments.services")


async function handleCreateComment(req, res) {
    try {
        const userId = req.user.userId
        const {postId} = req.params
        const {content} = req.body

        const comment = await createComment(userId, postId, content)

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        })
    } catch (error) {
        if(error.message === "Comment cannot be empty"){
            res.status(400).json({
                error: error.message
            })
        }
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    handleCreateComment
}