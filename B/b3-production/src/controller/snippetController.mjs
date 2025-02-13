import { SnippetModel as model } from '../model/snippet.mjs'
import { userController as UserController } from './userController.mjs'

export const  snippetController = {
  
  findAll : async (req, res, next) => {
    let snippets

    if (!req.session.user) {
      snippets = await model.findAll()
    } else {
      const user = await UserController.getUser(req.session.user.id)
      if (user instanceof Error) {
      const errorData = JSON.parse(user.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/home')
      return
      }
      snippets = await model.findAll(user)
    }

    if (snippets instanceof Error) {
      const errorData = JSON.parse(snippets.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/home')
      return
    }

    req.session.snippets = snippets
    next()
  },

  findOne : async (req, res, next) => {

    const snippet = await model.findOne(req.params.id)

    if (snippet instanceof Error) {
      const errorData = JSON.parse(snippet.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/snippet')
      return
    }

    snippet.creator = await UserController.getAuthorName(snippet.createdBy)
    req.session.snippets = [snippet]
    next()
  },

  create: async (req, res) => {
   
    req.body.createdBy = req.session.user.id
    const snippets = await model.create(req.body)

    if (snippets instanceof Error) {
      const errorData = JSON.parse(snippets.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/snippet')
      return
    }

    const snippetadd = await UserController.addSnippet(req.session.user.id, snippets.id)

    if (snippetadd instanceof Error) {
      const errorData = JSON.parse(snippetadd.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/snippet')
      return
    }

    req.session.snippets = [snippets]
    req.session.flashMessage = 'New Snippet Created'
    res.redirect('/snippet/' + snippets.id)
  },

  delete : async (req, res) => {

    const deleted = await model.delete(req.params.id)
    if (deleted instanceof Error) {
      const errorData = JSON.parse(deleted.message)
      res.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/snippet')
    }

    const user = await UserController.removeSnippet(req.session.user.id, req.params.id)

    if (user instanceof Error) {
      const errorData = JSON.parse(user.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/snippet')
      return
    }

    req.session.flashMessage = 'Snippet deleted'
    res.status(204).end()
  },
  
  edit: async (req, res, next) => {
    req.body.id = req.params.id;
    const edited = await model.edit(req.params.id, req.body);
    
    if (edited instanceof Error) {
      const errorData = JSON.parse(edited.message);
      res.status(errorData.status).json({ error: errorData.message });
      return;
    }
    
    req.session.flashMessage = 'Snippet updated';
    req.session.snippets = edited;
    res.status(200).json({ message: 'Snippet updated' });
  }
  
  
  
}

