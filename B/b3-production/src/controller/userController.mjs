import { UserModel as model } from "../model/user.mjs"
import {sessionHandler} from "./sessionController.mjs"

const createError = (status, message) => new Error(JSON.stringify({status, message}))

export function renderRegister(req, res) {
  const flashMessage = sessionHandler.getFlashMessage(req) ?? null;
  const user = req.session.user ?? null;
  res.render('register', { flashMessage, user, info: 'Success' });
}

export const userController = {

  login: async(req, res, next) => {
    try {
      const user = await model.Login(req.body)
      const sessionUser = {
        id: user.id,
        username: user.userName,
        name: user.firstName + '' + user.lastName,
        email: user.email
      }
      req.session.user = sessionUser
      req.sessionUser.flashMessage = 'Successfully Log in'
      next()
    } catch(error) {
      req.session.flashMessage = error.message
      next()
    }
  },

  register: async (req, res, next) => {
   try {
    const user = await model.register(req.body)
    sessionHandler.setFlashMessage(req, 'Successfully registerat')
    next()
   } catch (error) {
    //req.session.flashMessage = error.message
    sessionHandler.setFlashMessage(req, error.message)
    next()
   }
  },

  addSnippet: async (userId, snippedId ) => {
    const adding = await model.addSnippet(userId, snippedId)
    if(adding instanceof Error) {
      return createError(500, 'Internal Server Error!')
    }
  },
  
  removeSnippet : async (userId, snippetId) => {
    try {
      await model.removeSnippet(userId, snippetId);
      return { message: 'Snippet removed successfully' };
    } catch (error) {
      console.error('Error removing snippet:', error);
      throw new Error('Failed to remove snippet');
    }
  },

  getUser: async (id) => {
    try {
      const user = await model.getUser(id)
      return user
    } catch (error) {
      return createError(500, 'Internal Server Error!')
    }
  },

  getAuthorName: async (id) => {
    return await model.getAuthorName(id)
  }
}