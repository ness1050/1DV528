import express from "express"
import { snippetController } from "../controller/snippetController.mjs"
import { Validator } from "../controller/verifier.mjs"
import { sessionHandler } from "../controller/sessionController.mjs"

const snippetRouter = express.Router()
export default snippetRouter


snippetRouter.get('/', snippetController.findAll, sessionHandler.snippets)

snippetRouter.get('/create', Validator.isLogged, sessionHandler.createSnippet)

snippetRouter.get('/:id', Validator.verifyId, snippetController.findOne, Validator.isPublic, sessionHandler.snippets)

snippetRouter.post('/create', Validator.isLogged, Validator.createSnippet, snippetController.create)

snippetRouter.delete('/:id/delete', Validator.isLogged, Validator.verifyId, snippetController.findOne, Validator.isPublic, Validator.verifySnippet, snippetController.delete)

snippetRouter.get('/:id/update', Validator.isLogged, Validator.verifyId, snippetController.findOne, Validator.isPublic, Validator.verifySnippet, sessionHandler.createSnippet)

snippetRouter.post('/:id/update', Validator.isLogged, Validator.verifyId, Validator.createSnippet, snippetController.edit)

snippetRouter.get('*', sessionHandler.else)
