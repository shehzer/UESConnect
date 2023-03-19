const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  qA: [{ question: String, answer: String }],
  positionID: String,
  resumeID: String,
})

module.exports =
  mongoose.models.Application ||
  mongoose.model('Application', applicationSchema)
