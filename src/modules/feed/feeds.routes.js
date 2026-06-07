const express = require("express")
const authenticate = require("../../middleware/auth.middleware")
const { handleGetFeed } = require("./feeds.controller")

const router = express.Router()



router.get("/", authenticate, handleGetFeed)

module.exports = router