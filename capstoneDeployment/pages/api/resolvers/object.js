// import {createWriteStream} from 'fs'
// import { getNamedType } from 'graphql'
// import {parse, join} from 'path'
// import {baseURL, S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION, S3_BUCKET_NAME} from '../config/default.json'
// const AWS = require('aws-sdk')
// const object = require('../models/Object')

// let s3 = new AWS.S3({
//   accessKeyId: S3_ACCESS_KEY,
//   secretAccessKey: S3_SECRET_ACCESS_KEY,
//   bucketName: S3_BUCKET_NAME,
//   region: S3_BUCKET_REGION
// });

// async function uploadToS3(name, body){
//   var params = { 
//     Bucket: S3_BUCKET_NAME,
//     Key: name,
//     Body: body
//   }
//   return s3.upload(params, function(err,data){
//     if(err){
//       console.log('error in callback')
//       console.log(err)
//     }
//     console.log('success')
//     console.log(data)
//   }).promise()
// }


// module.exports = {
//   Query: {
//     //look up for objects and returns the list of objects that it belongs to:
//     async getObjects(_, {objType, objId}){
//       console.log("hey you are here")
//       console.log(objType, objId)
//       let res = await object.find({objType: objType, objId: objId})
//       console.log(res)
//       return res
      
//     },
//   },
//   Mutation: {
//     async objectUploader(parent, { filename: { file }, objType, objId }) {


      
//       let { filename, createReadStream } = await file;
//       let objectId = await objId
//       let objectType = await objType
//       console.log("feil", objectId)
//       let stream = createReadStream();
//       console.log('fileActual', file)

//       let {
//         ext,
//         name,
//       } = parse(filename)

//       name = name.replace(/([^a-z0-9 ]+)/gi, '-').replace(' ', '_')
//       let fullName = `${name}-ID-${objectId}${ext}`
//       let res = await uploadToS3(fullName,stream)
//       let createdObject = new object({
//         filename: res.key,
//         url: res.Location,
//         objType: objectType,
//         objId: objectId,
//       })

//       console.log("createdObject", createdObject)
//       const result = await createdObject.save() //This is where MongoDB actually saves
//       console.log("this is result", result)
//       return {
//         id: result.id,
//         ...result._doc,
//       }
//     },
//     async uploadFile(_, {file} ) {

//       console.log(file)


//       let dataE = file[0].file

//       console.log(dataE.filename)
//       console.log(dataE.createReadStream)

//       const { createReadStream, filename } = await file;
   
     


//     }
//   },
// };
