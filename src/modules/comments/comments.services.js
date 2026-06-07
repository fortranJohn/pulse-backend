const pool = require("../../database/db")

async function createComment(userId, postId, content) {
    const client =await pool.connect()

    try {

       const results =  await client.query("BEGIN")

    //    Validate contents
        const cleanContent = content?.trim()

        if(!cleanContent || cleanContent === 0){
            throw new Error("Coment cannot be empty")
        }

        // Ensure post exists (clean error instead of database crash)
        const postCheck = await client.query(
            `
                SELECT id FROM posts WHERE id = $1;
            `,
            [postId]
        )

        if(postCheck.rowCount === 0){
            throw new Error("Post not found")
        }

        await client.query(
            `
                INSERT INTO comments (user_id, post_id, content)
                VALUES ($1, $2, $3)
                RETURNING *;
            `,
            [userId, postId, content]
        )

        // if(content.trim().length === 0){
        //     return res.status(400).json({
        //         error:"Content is required"
        //     })
        // }
        const comment = results.rows[0]

        await client.query(
            `
                UPDATE posts
                SET comments_count = comments_count + 1
                WHERE id = $1
            `,
            [postId]
        )

        await client.query("COMMIT")

        return comment
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

module.exports = {
    createComment
}