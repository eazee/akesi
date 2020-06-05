/* npm packages */
import bodyParser          from 'body-parser'
import cookieParser        from 'cookie-parser'
import express             from 'express'
import flash               from 'express-flash-messages'
import morgan              from 'morgan'
import redis               from 'redis'
import redisStore          from 'connect-redis'
import session             from 'express-session'
import passport            from 'passport'
import path                from 'path'
/* local imports */
import * as Authentication from './authentication'
import Routes              from './routes'
import * as InputHelper    from './helpers/input.helper'

/* init config */
import 'dotenv/config'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.PORT     = process.env.PORT     || 3030

/* log start-up */
console.log(`Starting akesi in ${process.env.NODE_ENV} mode...`)

/* create app */
const app         = express(),
      RedisStore  = redisStore(session),
      redisClient = redis.createClient()

/* configure views */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

/* https/proxy settings */
if(process.env.USE_HTTPS == 'true') app.set('trust proxy', 1)

/* set up console logging */
if(process.env.NODE_ENV == 'development') { app.use(morgan('dev'))  }
else                                      { app.use(morgan('tiny')) }

/* static files */
app.use('/assets', express.static(path.join(__dirname, 'assets')))

/* session & body/cookie parsing */
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    store:             new RedisStore({ client: redisClient }),
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false
}))

/* make flash messages accessible */
app.use(flash())

/* set locals - path() for links and InputHelper for forms */
app.locals.path        = (x) => process.env.ROOT_URL + x
app.locals.InputHelper = InputHelper

/* authentication */
Authentication.initialize(app, passport)
Authentication.routes(app, passport)

/* routes */
Routes(app)

/* done! start listening */
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`))