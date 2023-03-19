//This is where the actual logic comes in

const { exec } = require('child_process')
const Club = require('../models/Club')
const object = require('../models/Object')

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
        logoRes = null
      }
      let finalRes = {
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
        return await Club.find()
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
      //1 if something was deleted, 0 if nothing was deleted
    },
    // async editClub(_, {ID, clubInput:{name, department,description, execs}}){
    //     const wasEdited = (await Club.updateOne({_id: ID}, {name: name, department: department, description: description, execs: execs})).modifiedCount;
    //     return wasEdited;
    // }
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
      { clubId, execAdd: { name, role, year, program} }
    ) =>{
      console.log(name)
      let newExec = {
        name: name,
        role: role,
        year: year,
        program: program,
      }
      let changedClub = await Club.updateOne({_id: clubId}, {$push: {execs: newExec}})
      let res = await Club.findById(clubId)
      return res.execs[res.execs.length - 1]
    },
    editExec: async (
      _,
      { clubId, execInput: {  _id, name, role, year, program }}
    )=>{
      let execUpdate = {
        _id: _id,
        name: name,
        role: role,
        year: year,
        program,
      }
      console.log(clubId)
      let changedClub = await Club.updateOne({"_id": clubId, "execs._id": execUpdate._id}, {$set: {"execs.$" : execUpdate}})
      let res = await Club.findById(clubId)
      console.log(res)
      for(const e of res.execs){
        if(e._id == _id){
          return e
        }
      }
    },
  },
};