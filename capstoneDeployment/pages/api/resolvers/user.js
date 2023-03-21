import { user, pass } from '../config/default.json'
const User = require('../models/User')
const Club = require('../models/Club')
const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const transporter = require('../email/transporter')
import { Router, useRouter } from 'next/router'

/**
 *
 * Upon login I want to be able to
 *
 */
module.exports = {
  Mutation: {
    registerUser: async (
      _,
      { registerInput: { name, email, password, role, clubName } },
    ) => {
      // See if user already exists
      console.log(name, email, role, password)
      email = email.toLowerCase()
      const userExists = await User.findOne({ email })
      console.log(userExists)
      if (userExists) {
        throw new ApolloError(
          'User with this email is already registed ' + email,
          'USER_ALREADY_EXISTS',
        )
      }

      // Encrypt Password

      var encryptedPassword = await bcrypt.hash(password, 10)

      const user = new User({
        name: name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        role: role,
        clubName: clubName,
      })

      // Create Token
      try {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          config.jwtSecret,
          { expiresIn: 3600 },
        )

        user.token = token

        const url = `http://localhost:3000/confirmation/${token}`

        const options = {
          from: user,
          to: email,
          subject: 'Confirm Email!',
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        }

        await transporter.sendMail(options, function (err, info) {
          console.log('Sent: ' + info.response)
        })
      } catch (e) {
        console.log(e)
      }

      //   const clubExisits = await Club.findOne({ email});
      //   if (clubExisits) {
      //     throw new ApolloError(
      //         "Club with this name is already registed " + clubName,
      //         "CLUB_ALREADY_EXISTS"
      //         );
      //     }
      const newClub = new Club({
        name: clubName,
        department: null,
        description: null,
      })

      const clubRes = await newClub.save() //This is where MongoDB actually saves
      console.log(clubRes._id)
      user.clubID = clubRes._id
      console.log('Saved club ' + clubRes)

      const res = await user.save()

      return {
        id: res.id,
        ...res._doc,
      }
    },
    loginUser: async (_, { loginInput: { email, password } }) => {
      // Check if user exists
      const user = await User.findOne({ email })
      console.log(user)
      // console.log(user.confirmed)
      // if (!user.confirmed) {
      //   throw new Error('Please confirm your email to login')
      // }

      // Check if password is correct && Create new Token
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          config.jwtSecret,
          { expiresIn: 3600 },
        )
        user.token = token
        // return all the admins objects.
        if (user.role == 'MASTER') {
          console.log('THIS MAN IS A MASTER')
          const adminUsers = await User.find({ role: 'ADMIN' })
          adminUsers.forEach(
            (element) => (element.userID = element._id),
            // console.log(element._id)
            // console.log(element.userID)
            // element.userID = element._id
          )
          console.log(user.token)
          return {
            token: user.token,
            userRole: user.role,
            adminList: adminUsers,
          }
        }
        // Find associated Club
        const clubID = user.clubID

        //
        const userClub = await Club.findById(clubID)
        console.log(user.role)

        return {
          token: user.token,
          role: user.role,
          id: userClub.id,
          ...userClub._doc,
        }
      }
      throw new ApolloError('Incorrect password', 'INCORRECT_PASSWORD')

      // Create new Token
    },
    deleteUser: async (_, { email }) => {
      // Check if user exists
      const user = await User.findOne({ email })
      // Check if we got a user
      if (user) {
        const wasDeleted = (await User.deleteOne(user)).deletedCount
        return wasDeleted
      }
      throw new ApolloError('User does not exist ', 'INVALID_USER')
    },
    editUser: async (
      _,
      { changeUserInput: { email, password, newName, newPassword, newEmail } },
    ) => {
      console.log(email, password, newName, newPassword, newEmail)
      var changedUser = 0
      // Check if user exists
      const user = await User.findOne({ email })
      console.log(user)
      if (user && (await bcrypt.compare(password, user.password))) {
        if (newName) {
          changedUser = await (
            await User.updateOne(user, { name: newName })
          ).modifiedCount
        }
        if (newEmail) {
          changedUser = await (
            await User.updateOne(user, { email: newEmail })
          ).modifiedCount
        }
        if (newPassword) {
          var encryptedPassword = await bcrypt.hash(password, 10)
          changedUser = await (
            await User.updateOne(user, { password: encryptedPassword })
          ).modifiedCount
        }
        return true
      }
      throw new ApolloError(
        'User does not exist or wrong password ',
        'INVALID_Entry',
      )
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
}
