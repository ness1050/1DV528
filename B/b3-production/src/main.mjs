import express, { urlencoded} from 'express';
import { databaseController } from './controller/databaseController.mjs';
import session from 'express-session';
import flash from 'connect-flash';
import router from './route/mainRouter.mjs'
import http from 'http'
import { Server as SocketIo} from 'socket.io'
import { setIoInstance } from './model/ioIntance.mjs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'


console.log('Conneting to MongoDb') 
try {
  await databaseController.connectDatabase()
} catch (err) {
  console.log('Error while connecting!')
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();
const server = http.createServer(app)
const io = new SocketIo(server)
setIoInstance(io)
app.use(urlencoded({ extended: true }));
app.use(express.json())

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

io.on('connection', (socket) => {
  console.log("A has connected")

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.use(flash());
app.set('view engine', 'ejs')
//app.set('views', 'src/view')
const viewsPath = path.join(__dirname, 'view')
app.set('views', viewsPath)
app.use('/webapp/public', express.static(path.join(__dirname, 'public')));
app.use('/webapp/css', express.static(path.join(__dirname, 'css')))
//app.use('/webapp', router )
app.use('/', router)

export default (port = 3000) => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}
