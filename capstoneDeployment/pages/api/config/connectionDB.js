const mongoose = require('mongoose')

const MongoDb =
  'mongodb+srv://gabor:group16@cluster0.epckap1.mongodb.net/?retryWrites=true&w=majority'

const connectDb = async () => {
  try {
    await mongoose.connect(MongoDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('db success connect')
  } catch (err) {
    console.log('error connecting to database')
    console.log(err)
    process.exit(1)
  }
}

module.exports = connectDb
