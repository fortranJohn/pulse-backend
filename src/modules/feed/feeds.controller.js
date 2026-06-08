const { getFeed } = require("./feeds.services")
const {getCommentsForAllPosts} = require("./feeds.services")


async function handleGetFeed(req, res) {
    try {
        const userId = req.user.userId
    
        const limit = parseInt(req.query.limit) || 10
        const cursor = parseInt(req.query.cursor) || null

        const posts = await getFeed(userId, limit, cursor)
        const postIds = posts.map(post => post.post_id)

        const comments = await getCommentsForAllPosts(postIds)

        const nextCursor = posts.length > 0 
                                ? posts[posts.length - 1].created_at
                                : null
        

        const commentsByPost = {}

        for (const comment of comments) {
            if(!commentsByPost[comment.post_id]){
                commentsByPost[comment.post_id] = []
            }
            commentsByPost[comment.post_id].push(comment)
        }


      
          
        const feed = posts.map(post => ({...post,
            comments: commentsByPost[post.post_id] || []
        }))
            
    
       
        
        res.json({
            feed,
            pagination:{
                limit,
                nextCursor 
            }
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    handleGetFeed
}