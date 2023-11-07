const resSend = (res, error, data, message) => {
    res.send({error, data, message})
}


const usersDb = require('../schemas/useUsersSchema')
const postsDb = require('../schemas/usePostsSchema')
const messagesDb = require('../schemas/useMessagesSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = {
    register: async (req, res) => {
        const {username, pass1} = req.body

        const userExists = await usersDb.findOne({username})
        if (userExists) return resSend(res, true, null, "User already exists")

        const hash = await bcrypt.hash(pass1, 10)
        const newUser = new usersDb({
            username,
            image: "",
            password: hash
        })

        await newUser.save()
        resSend(res, false, null, null)
    },
    login: async (req, res) => {
        const {username, pass1} = req.body
        const userExists = await usersDb.findOne({username})

        if (userExists) {
            const passwordCompare = await bcrypt.compare(pass1, userExists.password)
            if (passwordCompare) {
                const user = {
                    id: userExists._id,
                    username: userExists.username
                }
                const token = jwt.sign(user, process.env.JWT_SECRET)
                // USER LOGS IN
                return resSend(res, false, {
                    id: userExists._id,
                    username: userExists.username,
                    image: userExists.image,
                    token
                }, null)
            } else {
                return resSend(res, true, null, "Bad credentials")
            }
        } else {
            return resSend(res, true, null, "User does not exist")
        }
    },
    autologin: async (req, res) => {
        const user = await usersDb.findOne({_id: req.user.id})
        return resSend(res, false, {id: user._id, username: user.username, image: user.image}, null)
    },
    updateUserPassword: async (req, res) => {
        const {username, pass1} = req.body

        const userExists = await usersDb.findOne({username})
        if (!userExists) return resSend(res, true, null, "User does not exist")

        const hash = await bcrypt.hash(pass1, 10)

        const newUser = await usersDb.findOneAndUpdate({username: username}, {$set: {password: hash}}, {new: true})
        resSend(res, false, null, null)
    },
    updateUserImage: async (req, res) => {
        const {image, id} = req.body

        const userExists = await usersDb.findOne({_id: id})
        if (!userExists) return resSend(res, true, null, "user does not exist")

        if (!image) return resSend(res, true, null, "Image URL is empty")

        const newUser = await usersDb.findOneAndUpdate({_id: id}, {$set: {image}}, {new: true})
        return resSend(res, false, {id: newUser._id, username: newUser.username, image: newUser.image}, null)
    },
    getPosts: async (req, res) => {
        const posts = await postsDb.find()
        return resSend(res, false, {posts}, null)
    },
    createPost: async (req, res) => {
        const {title, image, id} = req.body
        const user = req.user

        const newPost = new postsDb({
            title,
            image,
            likes: [],
            comments: [],
            username: user.username,
            time: Date.now()
        })
        await newPost.save()

        return resSend(res, false, {post: newPost}, null)
    },
    updatePostLikes: async (req, res) => {
        const {postId, username} = req.body

        const post = await postsDb.findOne({_id: postId})
        if (!post) return resSend(res, true, null, "Post does not exist")

        if (post.likes.includes(username)) {
            return resSend(res, true, null, "Like already exists")
        }

        const updatePost = await postsDb.findOneAndUpdate(
            {_id: postId},
            {"$push": {likes: username}},
            {new: true}
        )
        resSend(res, false, {post: updatePost}, null)
    },
    updatePostComments: async (req, res) => {
        const {postId, username, comment} = req.body

        const post = await postsDb.findOne({_id: postId})
        if (!post) return resSend(res, true, null, "Post does not exist")

        console.log(postId, username, comment)

        const updatePost = await postsDb.findOneAndUpdate(
            {_id: postId},
            {"$push": {comments: {username,comment,time: Date.now()}}},
            {new: true}
        )
        resSend(res, false, {post: updatePost}, null)
    },
    uniqueUsers: async (req, res) => {
        const user = req.user

        const uniqueUsers = await messagesDb.distinct(
            "fromUsername",
            {
                toUsername: user.username,
                fromUsername: {$ne: user.username},
            })

        return resSend(res, false, {uniqueUsers}, null)
    },
    userMessages: async (req, res) => {
        const {fromUsername} = req.body
        const user = req.user

        const messages = await messagesDb.find({
            $or: [
                {fromUsername: fromUsername, toUsername: user.username},
                {fromUsername: user.username, toUsername: fromUsername}
            ]
        })

        return resSend(res, false, {messages}, null)
    },
    sendMessage: async (req, res) => {
        const {fromUsername, toUsername, message} = req.body

        const newMessage = new messagesDb({
            fromUsername,
            toUsername,
            message,
            time: Date.now()
        })
        await newMessage.save()

        return resSend(res, false, {newMessage}, null)
    },
    users: async (req, res) => {
        const users = await usersDb.find()
        return resSend(res, false, {users}, null)
    },
}