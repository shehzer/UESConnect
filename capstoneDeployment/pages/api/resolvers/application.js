import { user, pass } from '../config/default.json'
const Application = require('../models/Application')
const transporter = require('../email/transporter')

module.exports = {
  Query: {
    //look up object syntax
    application: async(_, { ID }) =>{
      return await Application.findByID(ID)
    },
    getApplications: async (_, { amount, positionID }) => {
      if (positionID == null) {
        return await Application.find().sort({ name: -1 }).limit(amount)
      }
      return await Application.find({ positionID: positionID })
    },
  },
  Mutation: {
    createApplication: async (_, { applicationInput: { name, email, description, qA, positionID, resumeID } }) => {
      const createdApplication = new Application({ name, email, description, qA, positionID, resumeID })
      
      const res = await createdApplication.save()
  
      // Send a confirmation email
      const testAccount = { user, pass }
  
      const options = {
        from: testAccount.user,
        to: email,
        subject: 'Thanks for Applying!',
        text: "Hi BOT Woohoo! \n  We just received your application for the Backend Software Engineer - New Grad 2023 role. We're so excited you're interested in growing your career at Dune Mountain.",
      }
  
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err)
          return
        }
        console.log('Sent: ' + info.response)
      })
  
      return {
        id: res.id,
        ...res._doc,
      }
    },
    deleteApplication: async (_, { ID }) => {
      const wasDeleted = (await Application.deleteOne({ _id: ID })).deletedCount
      return wasDeleted
      //1 if something was deleted, 0 if nothing was deleted
    },
  },
}
