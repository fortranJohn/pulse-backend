const pool = require("../../database/db")


async function likePost(userId, postId) {
    const client = await pool.connect()

    try {
        await client.query("BEGIN");

        await client.query(
            `
                INSERT INTO likes(user_id, post_id)
                VALUES ($1, $2)
            `,
            [userId, postId]
        )

        await client.query(
            `
                UPDATE posts
                SET likes_count = likes_count + 1
                WHERE id = $1
            `,
            [postId]
        )

        await client.query("COMMIT")

    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }


   

   
}

async function unlikePost(userId, postId) {
    const client = await pool.connect()
    
    try {
        await client.query("BEGIN")
        const result = await client.query(
            `
                DELETE FROM likes
                WHERE user_id = $1
                AND post_id = $2
                RETURNING *
            `,
            [userId, postId]
        )

        if(result.rowCount === 0){
            throw new Error("Post not liked yet");
        }

        await client.query(
            `
                UPDATE posts
                SET likes_count = likes_count - 1
                WHERE id = $1
            `,
            [postId]
        )

        await client.query("COMMIT")

    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }




}



module.exports = {
    likePost,
    unlikePost
}