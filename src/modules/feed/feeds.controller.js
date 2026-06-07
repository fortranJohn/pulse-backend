const { getFeed } = require("./feeds.services")


async function handleGetFeed(req, res) {
    try {
        const userId = req.user.userId
        const limit = parseInt(req.query.limit) || 10
        const cursor = parseInt(req.query.cursor) || null

        const feed = await getFeed(userId, limit, cursor)

        const nextCursor = feed.length > 0 
                                ? feed[feed.length - 1].created_at
                                : null

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