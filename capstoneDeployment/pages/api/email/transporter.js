import { user, pass } from '../config/default.json'
 const nodemailer = require('nodemailer')
 // Send a confirmation email
 
 let testAccount = {
    user: user,
    pass: pass,
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  })

  module.exports = transporter