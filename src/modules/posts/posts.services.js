const pool = require("../../database/db")

async function createPost(userId, content) {
    const result = await pool.query(
        `
            INSERT INTO posts (user_id, content)
            VALUES ($1, $2)
            RETURNING *;
        `,
        [userId, content]
    )

    return result.rows[0]
}


module.exports = {
    createPost
}