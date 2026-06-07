const pool = require("../../database/db")

async function createUser(name, email, passwordHash) {
    const query = `
    INSERT INTO users (name, email, hash_password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `
    const result = await pool.query(query, [
        name,
        email,
        passwordHash
    ])

    return result.rows[0]
}

// LOGIN

async function getUserByEmail(email) {
    const result = await pool.query(
        `
            SELECT *
            FROM users
            WHERE email = $1
        `,
        [email]
    )

    return result.rows[0]
}

module.exports = {
    createUser,
    getUserByEmail
}