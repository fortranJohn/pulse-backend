const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
const pool = require("./database/db")
const userRoutes = require("./modules/users/users.routes");
const postRoutes = require("./modules/posts/posts.routes")
const feedsRoutes = require("./modules/feed/feeds.routes")
const authenticate = require('./middleware/auth.middleware');
const likesRoutes = require("./modules/likes/likes.routes")
const commentRoutes = require("./modules/comments/comments.routes")
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (req, res)=>{
    res.json({
        status: "Ok",
        message:"Pulse API is running"
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

app.get("/db-test", async (req, res)=>{
    try {
        const result = await pool.query("SELECT NOW()")
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ 
            error: err.message
        })
    }
})

app.get(
    "/profile",
    authenticate,
    (req, res) => {
        res.json({
            message: "Protected route accessed",
            user: req.user
        })
    }
)

app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/feeds", feedsRoutes)
app.use("/likes", likesRoutes)
app.use("/comments", commentRoutes)