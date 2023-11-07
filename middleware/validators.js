const resSend = (res, error, data, message) => {
    res.send({error, data, message})
}

const jwt = require('jsonwebtoken')

module.exports = {
    validRegister: (req, res, next) => {
        const {
            username,
            pass1,
            pass2
        } = req.body

        if (username.length < 4 || username.length > 20) return resSend(res, true, null, "Username must be 4-20 characters")
        if (pass1.length < 4 || pass1.length > 20) return resSend(res, true, null, "Password must be 4-20 characters")
        if (pass1 === pass1.toLowerCase()) return resSend(res, true, null, "Password should have at least 1 upper case")
        if (pass1 !== pass2) return resSend(res, true, null, "Passwords should match")

        return next()
    },
    validLogin: (req, res, next) => {
        const {
            username,
            pass1,
        } = req.body

        if (username.length < 4 || username.length > 20) return resSend(res, true, null, "Username must be 4-20 characters")
        if (pass1.length < 4 || pass1.length > 20) return resSend(res, true, null, "Password must be 4-20 characters")
        if (pass1 === pass1.toLowerCase()) return resSend(res, true, null, "Password should have at least 1 upper case")

        return next()
    },
    authorize: (req, res, next) => {
        const token = req.headers.authorization

        jwt.verify(token, process.env.JWT_SECRET, async (err, item) => {
            if (err) {
                return resSend(res, true, null, "Bad credentials")
            }
            req.user = item

            return next()
        })
    },
}