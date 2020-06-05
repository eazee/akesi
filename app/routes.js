import * as MemberController from './controllers/member.controller'

function only(who, options={}) {
    return (req, res, next) => {
        let allowed = false
        let redir   = (options.redirect) ? options.redirect : '/login'
        if(who === 'members') allowed = (req.isAuthenticated())
        if(who === 'guests')  allowed = (!req.isAuthenticated())
        if(allowed) return next()
        if(options.flash) req.flash('error', "Sorry! You're not allowed to visit that page.")
        return res.redirect(redir)
    }
}

export default function(app) {
    /* registration */
    app.get ('/register', only('guests', { redirect: '/dashboard' }), MemberController.create_get)
    app.post('/register', only('guests', { redirect: '/dashboard' }), MemberController.create_post)

    /* login */
    app.get('/login', only('guests', { redirect: '/dashboard' }), (req, res) => res.render('authentication/login'))

    /* homepage */
    app.get('/', (req, res) => res.render('homepage', { bodyClass: 'fullheight-page' }))

    /* member dashboard */
    app.get('/dashboard', only('members'), (req, res) => res.render('dashboard'))

    /* 404 */
    app.use((req, res, next) => res.status(404).send("Sorry! We couldn't find that page!"))
}