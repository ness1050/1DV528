import { validate as uuidValidator} from 'uuid'

const errorValidtor = (res, view, message, info = null, user = null) => {
  res.status(400).render(view, {flashMessage: message, info, user})
}


export const Validator = {

  register: (req, res, next) => {
    const {firstName, lastName, userName, password, email} = req.body
    const varification = [
      { check: !firstName, message: 'Please enter your first name' },
      { check: !lastName, message: 'Please enter your last name' },
      { check: !userName, message: 'Please enter your username' },
      { check: !email, message: 'Please enter your email' },
      { check: !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/), message: 'Please enter a valid email address' },
      { check: !password, message: 'Please enter your password' },
      { check: password && password.length < 8, message: 'Password must be at least 8 characters long' },
      { check: password && !password.match(/[A-Z]/), message: 'Password must contain at least one uppercase letter' },
      { check: password && !password.match(/[a-z]/), message: 'Password must contain at least one lowercase letter' },
      { check: password && !password.match(/[0-9]/), message: 'Password must contain at least one number' },
    ]
    
    for (let {check, message} of varification) {
      if(check) return res.status(400).render('register', {flashMessage: message, info: req.body})
    }
    next()
  },

  createSnippet : (req, res, next) => {
    const user = req.session.user ?? null
    const { title, snippet, language, description } = req.body
    if (!user) return res.status(403).render('login', { flashMessage: 'Please login to be able to create snippets', user, snippets: [req.body] })
    if (!uuidValidator(user.id)) return res.status(401).render('login', { flashMessage: 'Something is wrong with your credintials', user, snippets: [req.body] })
    if (!title) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a title', user, snippets: [req.body] })
    if (!snippet) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a snippet', user, snippets: [req.body] })
    if (!language) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a language', user, snippets: [req.body] })
    if (!description) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a description', user, snippets: [req.body] })
    if (!req.body.private) req.body.isPublic = true
    if (req.body.private) req.body.isPublic = false
    next()
  }
  ,

  login: (req, res, next ) => {
    const {userName, password} = req.body
    if(!userName || !password) {
      return errorValidtor(res, 'login', 'Please enter your username and password');
    }
    next()
  },

  isLogged: (req, res, next) => {
    if(!req.session.user) {
      return errorValidtor(res, 'login', 'You have to be logged in to continue')
    }
    next()
  },

  allowTOregister: async (req, res, next) =>  {
    if(req.session.user) return res.status(400).render('home', {flashMessage: 'already loggedi n', 
    user: req.session.user})
    next()
  },

  isPublic: async (req, res, next) => {
    const snippet = req.session.snippets
    if(!snippet[0].isPublic) {
      if(!req.session.user || req.session.user.id !== snippet[0].createdBy) {
        req.session.flashMessage = 'Invalid snippet id'
        return res.status(404).redirect('/snippet')
      }
    }
    next()
  },

  verifySnippet: async (req, res, next) => {
    const user = req.session.user
    const snippet = req.session.snippets
    if(user.id !== snippet[0].createdBy) {
      req.session.flashMessage = 'You dont have access to edit/update this snippet'
      return res.status(401).redirect('/snippet')
    }
    next()
  },

  verifyId: async (req, res, next) => {
    const id = req.params.id
    if (!uuidValidator(id)) {
      req.session.flashMessage = 'Inavlid Id'
      return res.status(400).redirect('/snippet')
    }
    next()
  }

}