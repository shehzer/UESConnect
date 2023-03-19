const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const clubSchema = new mongoose.Schema({
  name: String,
  department: String,
  description: String,
  execs: [{ name: String, role: String, year: String, program: String }],
})

module.exports = mongoose.models.Club || mongoose.model('Club', clubSchema)
