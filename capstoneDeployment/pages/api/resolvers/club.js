const { exec } = require('child_process')
const Club = require('../models/Club')
const object = require('../models/Object')
import {createWriteStream} from 'fs'
import { getNamedType } from 'graphql'
import {parse, join} from 'path'
import {baseURL, S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION, S3_BUCKET_NAME} from '../config/default.json'
const AWS = require('aws-sdk')

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
    club: async (_, { ID })=> {
      let res = await Club.findById(ID)
      let logoRes = await object.find({objType: "logo", objId: ID})
      console.log(logoRes)
      try{
        logoRes = logoRes[0].url
      } catch(error){
        logoRes = "https://stackdiary.com/140x100.png"
      }
      let finalRes = {
        _id: res._id.toString(),
        name: res.name,
        department: res.department,
        description: res.description,
        logoURL: logoRes,
        execs: [],
      }
      let counter = 0;
      for (const e of res.execs){
        let logoRes = await object.find({objType: "headshot", objId: e._id.toString()})
        let newExec = {
          _id: res.execs[counter]._id.toString(),
          name: res.execs[counter].name,
          role: res.execs[counter].role,
          year: res.execs[counter].year,
          program: res.execs[counter].program,
          headshotURL: "https://stackdiary.com/140x100.png",
        }
        
        finalRes.execs.push(newExec)
        try{
          finalRes.execs[counter].headshotURL = logoRes[0].url
        } catch(error){
          console.log("null value")
        }
        counter = counter + 1;
      }
      return finalRes
    },
    getClubs: async (_, { amount }) => {
      if (amount == null) {
        let allClubs = await Club.find()
        for(const club of allClubs){
          let clubLogo = "https://stackdiary.com/140x100.png"
          try{
            let queryForLogo = await object.findOne({objType: "logo", objId: club._id})
            clubLogo = queryForLogo.url
            Object.assign(club, {logoURL: clubLogo})
            console.log("this is the actual Club with a URL,", club)
          }catch{
            Object.assign(club, {logoURL: clubLogo})
            console.log("this is the dummy url,", club)
          }
        }
        return allClubs
      }
      return await Club.find().sort({ department: -1 }).limit(amount)
    },
  },
  Mutation: {
    createClub: async (
      _,
      { clubInput: { name, department, description, execs } },
    ) => {
      const createdClub = new Club({
        name: name,
        department: department,
        description: description,
        execs: execs,
      })

      console.log(name, department, description, execs)

      const res = await createdClub.save() //This is where MongoDB actually saves
      console.log(res)
      return {
        id: res.id,
        ...res._doc,
      }
    },
    deleteClub: async (_, { ID }) => {
      const wasDeleted = (await Club.deleteOne({ _id: ID })).deletedCount
      return wasDeleted
    },
    editClub: async(
      _,
      { ID, clubInput: { name, department, description, execs } },
    ) =>{
      console.log(name, department, execs, description)
      var changedClub = 0
      if (name) {
        changedClub = await (
          await Club.updateOne({ _id: ID }, { name: name })
        ).modifiedCount
      }
      if (department) {
        changedClub = await (
          await Club.updateOne({ _id: ID }, { department: department })
        ).modifiedCount
      }
      if (description) {
        changedClub = await (
          await Club.updateOne({ _id: ID }, { description: description })
        ).modifiedCount
      }
      if (execs) {
        changedClub = await (
          await Club.updateOne({ _id: ID }, { execs: execs })
        ).modifiedCount
      }

      return changedClub
    },
    addExec: async (
      _,
      { file, clubId, execAdd: { name, role, year, program} }
    ) =>{
      console.log(name)
      let newExec = {
        name: name,
        role: role,
        year: year,
        program: program,
      }
      let changedClub = await Club.updateOne({_id: clubId}, {$push: {execs: newExec}})
      console.log("asdads")
      let headshot = "https://stackdiary.com/140x100.png"
      if(file){
        console.log("file was not created")
        let { filename, createReadStream} = await file.file;
        let res = await Club.findById(clubId)
        let objectId = res.execs[res.execs.length - 1]._id.toString()
        let objectType = "headshot"
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
        headshot = result.url
      }
      let res = await Club.findOne({_id: clubId})
      let newerExec = {
        _id: res.execs[res.execs.length - 1]._id.toString(),
        name: res.execs[res.execs.length - 1].name,
        role: res.execs[res.execs.length - 1].role,
        year: res.execs[res.execs.length - 1].year,
        program: res.execs[res.execs.length - 1].program,
        headshotURL: headshot,
      }
      console.log("newer stuff", newerExec)
      return newerExec
    },
    editExec: async (
      _,
      { file, clubId, execInput: {  _id, name, role, year, program }}
    )=>{
      let execUpdate = {
        _id: _id,
        name: name,
        role: role,
        year: year,
        program: program,
      }
      console.log(clubId)
      let changedClub = await Club.updateOne({"_id": clubId, "execs._id": execUpdate._id}, {$set: {"execs.$" : execUpdate}})
      let headshotURL = "https://stackdiary.com/140x100.png"
      
      if(file){
        console.log("we are here")
        let { filename, createReadStream} = await file.file;
        let stream = createReadStream();
        let fullName = `${_id}${filename}`
        let resAWS = await uploadToS3(fullName,stream)
          let objChange = await object.updateOne({objId: _id, objType: "headshot"},{$set:{"url": resAWS.Location}})
          if(objChange.modifiedCount ==0){
            const objectNewer = new object({
              filename: filename,
              url: resAWS.Location,
              objType: "headshot",
              objId: _id,
            })
            let newObj = await objectNewer.save()
            headshotURL = newObj.url
            console.log("this is if it is net new",newObj)

          }
          console.log("this is if it changed", objChange)
          if(headshotURL == "https://stackdiary.com/140x100.png"){
            headshotURL = objChange.url
        }
      }
      else{
        try{
          headshotURL = (await object.findOne({objType:"headshot", objId: _id})).url
        }catch{
          console.log("headshot does not exist")
        }
      }
      let res = await Club.findById(clubId)
      console.log(res)
      for(const e of res.execs){
        if(e._id == _id){
           let newerExec = {
            _id: e._id,
            name: e.name,
            role: e.role,
            year: e.year,
            program: e.program,
            headshotURL: headshotURL
           }
           return newerExec
        }
      }
    },
    deleteExec: async (_, {clubId, execId}) =>{
      const wasDeleted = (await Club.update({"_id": clubId}, {$pull: {'execs':{"_id": execId}}})).modifiedCount
      try{
        let newQuery = await Object.deleteOne({ objId: execId, objType: "headshot" })
      }catch{
        console.log("No picture")
      }
        console.log(wasDeleted)
      return wasDeleted
    },
    uploadClubLogo: async(
      _,
      {file, clubId}
    ) =>{
      let objectResponse = await object.findOne({objType: "logo", objId: clubId})
      let { filename, createReadStream} = await file.file;
      let stream = createReadStream();
      let fullName = `${clubId}${filename}`
      let resAWS = await uploadToS3(fullName,stream)
      console.log(objectResponse)
      try{
        console.log(objectResponse.url)
        let objChange = await object.updateOne({objId: clubId, objType: "logo"},{$set:{"url": resAWS.Location}})
        console.log(objChange)

      }catch{
        console.log("we in here")
        let createdObject = new object({
          filename: resAWS.key,
          url: resAWS.Location,
          objType: "logo",
          objId: clubId,
        })
  
        console.log("createdObject", createdObject)
        const result = await createdObject.save() //This is where MongoDB actually saves
        console.log("this is result", result)
      }
      return resAWS.Location
    },
  },
};