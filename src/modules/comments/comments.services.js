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

async function likeComment(userId, commentId) {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")
        await client.query(
            `
                INSERT INTO comment_likes (user_id, comment_id)
                VALUES ($1, $2);
            `,
            [userId, commentId]
        )

        await client.query(
            `
                UPDATE comments
                SET likes_count = likes_count + 1
                WHERE id = $1
            `,
            [commentId]
        )

        await client.query("COMMIT")
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

async function unlikeComment(userId, commentId) {
    const client = await pool.connect()
    try {
        
        await client.query("BEGIN")
        const result = await client.query(
            `
                DELETE FROM comment_likes
                WHERE user_id = $1
                AND comment_id = $2
                RETURNING *
            `,
            [userId, commentId]
        )

        if(result.rowCount === 0){
            throw new Error("comment not liked yet")
        }

        await client.query(
            `
                UPDATE comments
                SET likes_count = likes_count - 1
                WHERE id = $1
            `,
            [commentId]
        )

        await client.query("COMMIT")


    } catch (error) {
       await client.query("ROLLBACK")
       throw error
    } finally {
        client.release()
    }
}

async function createReply(userId, commentId, content) {
    const client = await pool.connect()
    try {
       await client.query("BEGIN")

       const parentCommentResult = await client.query(
        `
            SELECT id, post_id
            FROM comments
            WHERE id = $1
        `,
        [commentId]
       )

       if(parentCommentResult.rowCount ===0){
        throw new Error("Parent comment not found")
       }
       const parentComment = parentCommentResult.rows[0]

       const replyResult = await client.query(
        `
            INSERT INTO comments (post_id, user_id, content, parent_comment_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *

        `,
        [parentComment.post_id, userId, content, commentId]
       )

       await client.query(
        `
            UPDATE posts
            SET comments_count = comments_count + 1
            WHERE id = $1
        `,
        [parentComment.post_id]
       )

       await client.query("COMMIT")
       return replyResult.rows[0]


    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

async function getCommentsForPost( postId, limit=10, cursor=null) {
    // const client = await pool.connect()
    const params = [postId]
    
    let cursorIndex = ""

    if(cursor){
        cursorIndex = "AND comments.created_at <  $2"
        params.push(cursor)
    }

    params.push(limit)
       
        const result = await pool.query(
            `
                SELECT comments.id, comments.parent_comment_id, comments.user_id, comments.content, comments.likes_count, comments.created_at, users.name AS author_name
                FROM comments
                JOIN users ON users.id = comments.user_id
                WHERE comments.post_id = $1
                ${cursor ? cursorIndex : ""}
                ORDER BY comments.created_at DESC
                LIMIT $${params.length}
            `,
           params
        )

       const comments = result.rows

    //    Building commentMap
    const commentsMap = {}
    for (const comment of comments ) {
        commentsMap[comment.id] = {
            ...comment,
            replies:[]
        }
    }
       
     for (const comment of Object.values(commentsMap)) {
        const parentId = comment.parent_comment_id;

        if (parentId && commentsMap[parentId]) {
            commentsMap[parentId]?.replies.push(comment);
        }
    }
      const commentTree = Object.values(commentsMap)
        .filter(comment => comment.parent_comment_id === null);

    return commentTree;
}



module.exports = {
    createComment,
    likeComment,
    unlikeComment,
    createReply,
    getCommentsForPost
}