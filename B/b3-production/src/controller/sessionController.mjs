import { gitlabService } from "../model/GitlabService.mjs"
import { getIoInstance } from "../model/ioIntance.mjs";
import dotenv from 'dotenv';
dotenv.config();

export const sessionHandler = {
  
  home: (req, res) => {
    const flashMessage = req.session.flashMessage ?? null
    const user = req.session.user ?? null
    req.session.flashMessage = null
    res.render('home', {user, flashMessage})
  },

  login: (req, res) => {
    const user = req.session.user ?? null;
    if(user) {
      req.session.flashMessage = 'You are already logged in';
      // Redirect to the GitLab issues page if already logged in
      return res.redirect('/gitlabIssues'); // This is the new part
    }
    const flashMessage = req.session.flashMessage ?? null;
    req.session.flashMessage = null;
    res.render('login', {flashMessage, user});
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
  },

  displayGitLabIssues: async (req, res) => {
    if (!req.session.user) {
      req.session.flashMessage = 'Please log in to view GitLab issues';
      return res.redirect('/login');
    }
  
    try {
      const issues = await gitlabService.fetchIssues(); // Assuming gitlabService is already implemented
      res.render('gitlabIssues', { issues}); // Pass the user if you need user context
    } catch (error) {
      console.error('Failed to fetch GitLab issues:', error);
      req.session.flashMessage = 'Failed to fetch GitLab issues';
      res.redirect('/home');
    }
  }

}

export const handleGitlabWebhook = async (req, res) => {
  const io = getIoInstance();
  if (!io) {
    console.error('Socket.io instance is not initialized');
    return res.status(500).send('Internal server error');
  }

  const token = req.headers['x-gitlab-token'];
  if (token !== process.env.WEBHOOK_SECRET) {
    return res.status(403).send('Forbidden');
  }
  
  console.log('Received GitLab webhook:', req.body);

  // Fetch the updated list of issues from GitLab and emit to all clients
  try {
    const updatedIssues = await gitlabService.fetchIssues();
    io.emit('updatedIssuesList', updatedIssues);
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Failed to fetch or emit issues:', error);
    res.status(500).send('Internal server error');
  }
};


