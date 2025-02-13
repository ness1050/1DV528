import express from 'express'
import { userController } from '../controller/userController.mjs'
import { Validator } from '../controller/verifier.mjs'
import { sessionHandler } from '../controller/sessionController.mjs'
import snippetRouter from './snippetRouter.mjs'

const router = express.Router()

router.get('/', sessionHandler.home)

router.get('/home', sessionHandler.home)

router.get('/login', sessionHandler.login)

router.post('/login', Validator.login, userController.login, sessionHandler.home)

router.get('/register', Validator.allowTOregister, sessionHandler.register)

router.post('/register', Validator.register, userController.register, sessionHandler.login)

router.use('/snippet', snippetRouter)

router.get('/logout', sessionHandler.logout)

router.get('*', sessionHandler.else)

export default router
