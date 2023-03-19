const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const objectSchema = new mongoose.Schema({
    filename: String,
    url: String,
    objType: String,
    objId: String,
})

module.exports = mongoose.models.Object|| mongoose.model('Object', objectSchema);