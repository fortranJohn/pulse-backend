
const pool = require("../../database/db")

async function getFeed(userId, limit=10, cursor) {

    let query
    let params

    if(cursor) {
        // query = `
        //     SELECT posts.*
        //     FROM posts
        //     JOIN follows ON follows.followee_id = posts.user_id
        //     WHERE follows.follower_id = $1
        //     AND posts.created_at < $3
        //     ORDER BY posts.created_at DESC
        //     LIMIT $2
        // `;

        query = `
            SELECT
                posts.id AS post_id,
                posts.user_id,
                content,
                users.name AS author_name,
                likes_count,
                comments_count,
                posts.created_at
            FROM posts
            JOIN follows ON follows.followee_id = posts.user_id
            JOIN users ON users.id = posts.user_id
            WHERE follows.follower_id = $1
            AND posts.created_at < $3
            ORDER BY posts.created_at DESC
            LIMIT $2
        `


        // query = `
        //     SELECT posts.*, users.name AS author_name
        //     FROM posts
        //     JOIN follows ON follows.followee_id = posts.user_id
        //     JOIN users ON users.id = posts.user_id
        //     WHERE follows.follower_id = $1
        //     AND posts.created_at < $3
        //     ORDER BY posts.created_at DESC
        //     LIMIT $2
        // `

        params = [userId, limit, cursor]
    } else {
        // query = `
        //     SELECT posts.*
        //     FROM posts
        //     JOIN follows ON follows.followee_id = posts.user_id
        //     WHERE follows.follower_id = $1
        //     ORDER BY posts.created_at DESC
        //     LIMIT $2

        // `;
        query = `
            SELECT
                posts.id AS post_id,
                posts.user_id,
                content,
                users.name AS author_name,
                likes_count,
                comments_count,
                posts.created_at
            FROM posts
            JOIN follows ON follows.followee_id = posts.user_id
            JOIN users ON users.id = posts.user_id
            WHERE follows.follower_id = $1
           
            ORDER BY posts.created_at DESC
            LIMIT $2
        `;

        params = [userId, limit];
    }

    const result = await pool.query(
       query, params
    );

    return result.rows
}

async function getCommentsForAllPosts(postIds) {
    try {
        const result = await pool.query(
            `
                SELECT * FROM comments
                WHERE post_id = ANY($1)
                ORDER BY created_at DESC;
            `,
            [postIds]
        )

        
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    getFeed
}