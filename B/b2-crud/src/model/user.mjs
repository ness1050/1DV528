'use strict'

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'


const userData = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  userName: {type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  snippets: [{type: String}]
}, {timestamps: true})

const User = mongoose.model('User', userData)
const createError = (status, message) => new Error(JSON.stringify({status, message}))

async function findUniquUser(f, value, errorMessage) {
  const exists = await User.findOne({[f]: value})
  if (exists) throw createError(409, errorMessage)
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function generateUserId() {
  let count = 10
  while (count--) {
    const id = uuidv4()
    const exists = await User.findOne({id})
    if(!exists) {
      return id
    }
    if (count === 0 ) {
      throw createError(500, 'Server Error')
    }
  }
}

export const UserModel = {
  
  register: async (user) => {
    await findUniquUser('email', user.email, 'Email already used/exist!!')
    await findUniquUser('username', user.userName, 'Name already exists!')
    user.password = await hashPassword(user.password)
    user.id = await generateUserId()
    const newUser = new User(user)
    await newUser.save()
    return newUser
  },

  Login: async ({userName, password}) => {
    const user = await User.findOne({userName})
    if (!user) throw createError(404, 'No user found!!')
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw createError(401, 'Incorrect password')
    return user
  },

  getAuthorName: async (id) => {
   try {
    const user = await User.findOne({id})
    if(!user) {
      return 'Could not find any Authour'
    }
    return user.firstName + ' ' + user.lastName
   } catch (err) {
    throw createError (404, 'No user as creator found!')
   }
  },

  getUser: async (id) => {
    const user = await User.findOne({id})
    if(!user) throw createError(404, 'No user found')
    return user
  },

  addSnippet: async (Userid, snippetId) => {
    const user = await UserModel.getUser(Userid)
    user.snippets.push(snippetId)
    await user.save()
  },

  removeSnippet: async (Userid, snippetId) => {
    const user = await UserModel.getUser(Userid)
    const index = user.snippets.indexOf(snippetId)
    if (index > -1) user.snippets.splice(index, 1)
    await user.save()
  }
}
