const {createUser,
        getUserByEmail
} = require("./users.service")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function handleCreateUser(req, res) {
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }

        const saltRound = 10

        const passwordHash = await bcrypt.hash(password, saltRound)

        const user = await createUser(name, email, passwordHash)

        res.status(201).json({
            message: "User created successfully",
            user
        })
    } catch (error) {
        if(error.code=="23505"){
            return res.status(409).json({
                error: "Email already exists"
            })
        }
        res.status(500).json({
            error: error.message
        })
    }
}

async function handleLogin(req, res) {
    try {
        const {email, password} = req.body
        const user = await getUserByEmail(email)

        if(!user) {
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }
        const isValidPassword = await bcrypt.compare(password, user.hash_password)
        if(!isValidPassword){
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }
        const token = jwt.sign(
            {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )

    res.json({
        message: "User logged in successfully",
        token
    })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
module.exports = {
    handleCreateUser,
    handleLogin
}