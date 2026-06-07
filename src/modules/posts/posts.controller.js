const { createPost } = require("./posts.services");



async function handleCreatePost(req, res) {
    try {
        const userId = req.user.userId; //from JWT middleware
        const {content} = req.body

        if(!content){
            return res.status(400).json({
                error: "Content cannot be blank"
            })
        }

        const post = await createPost(userId, content)
        console.log("REQ.USER:", req.user);
        res.status(201).json({
            message: "Post created successfully",
            post
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    handleCreatePost
}