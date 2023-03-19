const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'CLUB_EXECUTIVE'],
  },
  token: {
    type: String,
  },
  clubName: {
    type: String,
    required: true,
    unique: true,
  },
  clubID: {
    type: String,
  },
  confirmed: {
    type: Boolean,
    default: false
  }
})

const User = (module.exports =
  mongoose.models.User || mongoose.model('User', userSchema))
