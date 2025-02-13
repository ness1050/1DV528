import express, { urlencoded} from 'express';
import { databaseController } from './controller/databaseController.mjs';
import session from 'express-session';
import flash from 'connect-flash';
import router from './route/mainRouter.mjs'

console.log('Conneting to MongoDb') 
try {
  await databaseController.connectDatabase()
} catch (err) {
  console.log('Error while connecting!')
}

const app = express();
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

app.use(flash());
app.set('view engine', 'ejs')
app.set('views', 'src/view')
app.use('/css', express.static('src/css'))
app.use('/public', express.static('public'));
app.use('/', router )

export default (port = 3000) => {
  app.listen(port, () => {console.log(`Server running on port ${port}`)}
  );
}
