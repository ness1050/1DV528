import express from 'express'
import { userController } from '../controller/userController.mjs'
import { Validator } from '../controller/verifier.mjs'
import { sessionHandler } from '../controller/sessionController.mjs'
import snippetRouter from './snippetRouter.mjs'
import { handleGitlabWebhook } from '../controller/sessionController.mjs'



const router = express.Router()

router.get('/', sessionHandler.home)

router.get('/webapp', sessionHandler.home)


router.get('/webapp/login', sessionHandler.login)

router.post('/webapp/login', Validator.login, userController.login, sessionHandler.home)

router.get('/webapp/register', Validator.allowTOregister, sessionHandler.register)

router.post('/webapp/register', Validator.register, userController.register, sessionHandler.login)

router.use('/webapp/snippet', snippetRouter)

router.get('/webapp/logout', sessionHandler.logout)

router.get('/webapp/gitlabIssues', sessionHandler.displayGitLabIssues);

// Add this in your main router file or a specific router file if you have one for webhooks
router.post('/webapp/gitlab-webhook', handleGitlabWebhook)
  

router.get('*', sessionHandler.else)

export default router
