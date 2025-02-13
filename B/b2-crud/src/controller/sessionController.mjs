
export const sessionHandler = {
  
  home: (req, res) => {
    const flashMessage = req.session.flashMessage ?? null
    const user = req.session.user ?? null
    req.session.flashMessage = null
    res.render('home', {user, flashMessage})
  },

  login: (req, res) => {
    const user = req.session.user ?? null
    if(user) {
      req.session.flashMessage = 'You are already logged in'
      res.render('home')
    }
    const flashMessage = req.session.flashMessage ?? null
    req.session.flashMessage = null
    res.render('login', {flashMessage, user})
  },

  logout: (req, res) => {
    req.session.flashMessage = null
    req.session.user = null
    req.session.snippets = null
    const flashMessage = 'You have been logout!!'
    res.render('home', {flashMessage, user:null})
  },

  register: (req, res) => {
    const flashMessage = req.session.flashMessage ?? null
    const user = req.session.user ?? null
    req.session.flashMessage = "ok"
    res.render('register', {flashMessage, user, info:'Success'})
  },


  snippets: (req, res) => {
    const flashMessage = req.session.flashMessage ?? null
    const user = req.session.user ?? null
    req.session.flashMessage = null
    const snippets = req.session.snippets ?? null
    req.session.snippets = null
    res.render('snippet', {snippets, user, flashMessage})
  },

  createSnippet: (req, res) => {
    
    const flashMessage = req.session.flashMessage ?? null
    const user = req.session.user ?? null
    req.session.flashMessage = null
    const snippets = req.session.snippets ?? null
    req.session.snippets = null

    res.render('createSnippet', { snippets, user, flashMessage, isPublic: true })

  },
  
  else: (req, res) => {
    const flashMessage = req.session.flashMessage ?? null
    const user = req.session.user ?? null
    req.session.flashMessage = null
  
    res.status(404).render('error', {url:req.url, user, flashMessage})
  },

  setFlashMessage: (req, message) => {
    req.session.flashMessage = message;
  },

  getFlashMessage: (req) => {
    const message = req.session.flashMessage;
    req.session.flashMessage = null;
    return message;
  }
  
}
