const { createComment, likeComment, unlikeComment, getCommentsForPost, createReply } = require("./comments.services")


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

async function handleCreateReply(req, res) {
   

    try {
            const userId = req.user.userId
            const commentId = req.params.commentId
            const content = req.body.content

            if(!content || !content.trim()){
                return res.status(400).json({
                    message: "Content cannot be empty"
                })
            }


            const reply = await createReply(userId, commentId, content.trim())

            res.status(201).json({
                reply,
                message:"reply created"
            })

    } catch (error) {
        if(error.message === "Parent comment not found"){
            return res.status(404).json({
                error:error.message
            })
        }
        return res.status(500).json({
            error:error.message
        })
    }
}

async function handleGetCommentsForPost(req, res) {
    try {
        // const userId = req.user.userId
        const limit = parseInt(req.query.limit) || 10
        const postId = req.params.postId
        const cursor = req.query.cursor || null
        
        const postComments = await getCommentsForPost( postId, limit, cursor )

        const nextCursor = postComments.length > 0 
        ? postComments[postComments.length - 1].created_at : null


        res.status(200).json({
            postComments,
            pagination: {
                limit,
                nextCursor
            }
           
        })
    } catch (error) {
            return res.status(500).json({
                error: error.message
            })
    }
}




module.exports = {
    handleCreateComment, handleLikeComment, handleUnlikeComment, handleCreateReply, handleGetCommentsForPost
}