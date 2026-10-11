const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [ 
         true,
         'username required'
      ],
   },
   email: {
      type: String,
      required: [
         true,
         'email required'
      ],
      unique: true,
      match: [
         /^(?=.{1,256}$)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2,}|xn--[a-zA-Z0-9]+)$/
         , 'valid email required'
      ]
   },
   password: {
      type: String,
      required: [
         true,
         'password required'
      ],
      minlength: 4,
      select: false,
   },
})

UserSchema.pre('save', async function () {
   if (!this.isModified('password')) return

   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.matchPasswords = async function (password) {
   return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getSignedToken = function () {
   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
}

module.exports = mongoose.model('User', UserSchema)