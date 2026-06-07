const express = require("express")
const router = express.Router()

const {handleCreateUser, handleLogin} = require("./users.controller")


router.post("/", handleCreateUser)
router.post("/login", handleLogin)


module.exports = router