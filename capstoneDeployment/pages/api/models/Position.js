const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const positionSchema = new mongoose.Schema({
  name: String,
  description: String,
  numberOfOpenings: Number,
  skills: [{ skill: String }],
  q: [{ question: String }],
  clubId: String,
})

module.exports =
  mongoose.models.Position || mongoose.model('Position', positionSchema)
