import { user, pass } from '../config/default.json'
const Application = require('../models/Application')
const transporter = require('../email/transporter')
import { getNamedType } from 'graphql'
import {parse, join} from 'path'
import {baseURL, S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION, S3_BUCKET_NAME} from '../config/default.json'
const AWS = require('aws-sdk')
const object = require('../models/Object')

let s3 = new AWS.S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  bucketName: S3_BUCKET_NAME,
  region: S3_BUCKET_REGION
});

async function uploadToS3(name, body){
  var params = { 
    Bucket: S3_BUCKET_NAME,
    Key: name,
    Body: body
  }
  return s3.upload(params, function(err,data){
    if(err){
      console.log('error in callback')
      console.log(err)
    }
    console.log('success')
    console.log(data)
  }).promise()
}


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
      let appRes = await Application.find({ positionID: positionID })
      for(const e of appRes){
        let resumeURL = "No Resume"
        try{
          resumeURL = (await object.findOne({objId: e._id.toString(), objType: "resume"})).url
          console.log("resumeURL --", resumeURL)
        }catch{
          console.log("no resume")
        }
        Object.assign(e, {resumeURL: resumeURL})
        console.log(e)
      }
      return appRes
    },
  },
  Mutation: {
    createApplication: async (_, {file, applicationInput: { name, email, description, qA, positionID} }) => {
      const createdApplication = new Application({ name, email, description, qA, positionID})
      console.log("we in here")
      const res = await createdApplication.save()
      let objectId = res._id.toString()
      let { filename, createReadStream} = await file.file;
      let objectType = "resume"
      let stream = createReadStream();
      let fullName = `${objectId}${filename}`
      let resAWS = await uploadToS3(fullName,stream)
      let createdObject = new object({
        filename: resAWS.key,
        url: resAWS.Location,
        objType: objectType,
        objId: objectId,
      })

      console.log("createdObject", createdObject)
      const result = await createdObject.save() //This is where MongoDB actually saves
      console.log("this is result", result)
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
      const wasDeleted = (await Application.deleteOne({ _id: ID }))
      console.log(wasDeleted)
      return wasDeleted
      //1 if something was deleted, 0 if nothing was deleted
    },
  },
}
