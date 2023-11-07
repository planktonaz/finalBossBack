express = require('express')
const router = express.Router()

const {
    register,
    login,
    autologin,
    updateUserImage,
    updateUserPassword,
    getPosts,
    createPost,
    updatePostLikes,
    updatePostComments,
    userMessages,
    uniqueUsers,
    sendMessage,
    users,
} = require("../controllers/mainController")

const {validRegister, validLogin, authorize} = require("../middleware/validators")

router.post("/register", validRegister, register)
router.post("/login", validLogin, login)
router.post("/autologin", authorize, autologin)

router.post("/updateUserPassword", validRegister, updateUserPassword)
router.post("/updateUserImage", authorize, updateUserImage)

router.post("/getPosts", authorize, getPosts)
router.post("/createPost", authorize, createPost)
router.post("/updatePostLikes", authorize, updatePostLikes)
router.post("/updatePostComments", authorize, updatePostComments)

router.post("/uniqueUsers", authorize, uniqueUsers)
router.post("/userMessages", authorize, userMessages)
router.post("/sendMessage", authorize, sendMessage)

router.post("/users", authorize, users)

module.exports = router
