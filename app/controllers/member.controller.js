import * as Member from '../models/member.model'
import validate    from '../helpers/validation.helper'

const member_create_params = {
    email: 'email|required',
    username: 'string|between:2,30|regex:/^([A-Za-z0-9-_]+)$/|required',
    password: 'string|between:8,120|required'
}

export function create_get(req, res) {
    res.render('authentication/register')
}

export function create_post(req, res) {
    if(!validate(req, member_create_params)) return res.render('authentication/register')
    Member.create({
        email: req.body.email, username: req.body.username,
        password: req.body.password
    })
    .then(user => {
        req.flash('success', "Your account was created! You should be able to log in now.")
        res.redirect('/login')
    })
    .catch(err => {
        if(err.constraint && err.constraint == 'members_email_key') {
            req.flash('error', "That email address is already registered!")
        } else if(err.constraint && err.constraint == 'members_username_key') {
            req.flash('error', "That username is already registered!")
        } else {
            console.error("Error trying to create account:", err)
            req.flash('error', "Sorry! Something went wrong on our end and your account couldn't be created.")
        }
        return res.render('authentication/register', { body: req.body })
    })
}