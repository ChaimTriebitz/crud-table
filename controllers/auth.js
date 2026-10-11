const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

module.exports = {
   register,
   login,
}

async function register(req, res, next) {
   const { username, email, password } = req.body

   try {
      const user = await User.create({ username, email, password })
      sendToken(user, 200, res)
   } catch (err) {
      next(err)
   }
}

async function login(req, res, next) {
   const { username, password } = req.body
   if (!username || !password) return next(new ErrorResponse('Username & Password required', 400))
   try {
      const user = await User.findOne({ username }).select('+password')
      if (!user) return next(new ErrorResponse('Invalid credentials', 401))
      const isMatch = await user.matchPasswords(password)
      if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401))
      sendToken(user, 201, res)
   } catch (error) {
      res.status(500).json({ success: false, error: error.message })
   }
}

function sendToken(user, statusCode, res) {
   const token = user.getSignedToken()
   res.status(statusCode).json({ success: true, token })
}

