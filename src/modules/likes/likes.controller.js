

const { likePost, unlikePost } = require("./likes.service")



async function handleLikePost(req, res) {
console.log("LIKE REQUEST USER:", req.user.userId);
console.log("POST ID:", req.params.postId);
    try {
        const userId = req.user.userId
        const {postId} = req.params

        const like = await likePost (
            userId, postId
        )

        res.status(201).json(like)
    } catch (error) {
        if(error.code === "23505"){
            return res.status(409).json({
                error: "Already liked"
            })
        }
        res.status(500).json({
            error:error.message
        })
    }
}

async function handleUnlikePost(req, res) {
    try {
        const userId = req.user.userId
        const postId = req.params.postId

        const unlike = await unlikePost(userId, postId)

        res.status(201).json({
            unlike,
            message:"Post unliked"
        })
    } catch (error) {

         if(error.code === "23505"){
            return res.status(409).json({
                error: "Already unliked"
            })
        }

        // if(error.message === "Post not liked yet"){
        //     return res.status(400).json({
        //         error: error.message
        //     })
        // }

        return res.status(500).json({
        error: error.message
    })
    }

    
}

module.exports = {
    handleLikePost, handleUnlikePost
}