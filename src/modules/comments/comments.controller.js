const { createComment, likeComment, unlikeComment } = require("./comments.services")


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

async function handleLikeComment(req, res) {
    try {
        const userId = req.user.userId
        const commentId = req.params.commentId

        const likeComm = await likeComment(userId, commentId)

        res.status(201).json({
            likeComm,
            message: "Comment liked"
        })
    } catch (error) {
        if(error.code === "23505"){
            return res.status(409).json({
                error: "Already unliked"
            })
        }
        return res.status(500).json({
            error:error.message
        })
    }
}

async function handleUnlikeComment(req, res){
    try {
        const userId = req.user.userId
        const commentId = req.params.commentId

        const unlikeComm = await unlikeComment(userId, commentId)

        res.status(201).json({
            unlikeComm,
            message: "Unliked comment"
        })
    } catch (error) {
         if(error.code === "23505"){
            return res.status(409).json({
                error: "Already unliked"
            })
        }
        return res.status(500).json({
            error: error.message
        })
    }
}


module.exports = {
    handleCreateComment, handleLikeComment, handleUnlikeComment
}