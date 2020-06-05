import { Strategy as LocalStrategy } from 'passport-local'
import * as Member                   from './models/member.model'

export function initialize(app, passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((uuid, done) => {
        Member.find(uuid)
            .then(user => {
                if(!user) return done(new Error("no such user"))
                return done(null, user)
            })
            .catch(err => done(err))
    })

    passport.use(new LocalStrategy((username, password, done) => {
        Member.find_by_username_password(username, password)
            .then(user => {
                if(!user) return done(null, false, { message: "Invalid username or password" })
                return done(null, user)
            })
            .catch(err => done(err))
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use((req, res, next) => {
        res.locals.user = (req.isAuthenticated()) ? req.user : false
        return next()
    })
}

export function routes(app, passport) {
    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/dashboard',
        failureFlash: true, session: true
    }))
    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })
}