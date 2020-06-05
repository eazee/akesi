import bcrypt         from 'bcryptjs'
import {v4 as uuidv4} from 'uuid'
import shortid        from 'shortid'
import pool           from '../db/pool'

export async function find(uuid) {
    const find_member_query = `SELECT id, email, 
    username, signup_token FROM members WHERE id = $1`
    return new Promise((resolve, reject) => {
        pool.query(find_member_query, [uuid])
            .then(res => resolve(res.rows[0]))
            .catch(err => reject(err))
    })
}

export async function find_by_username(username) {
    const find_member_query = `SELECT id, email, 
    username, signup_token FROM members WHERE username = $1`
    return new Promise((resolve, reject) => {
        pool.query(find_member_query, [username])
            .then(res => resolve(res.rows[0]))
            .catch(err => reject(err))
    })
}

export async function find_by_username_password(username, password) {
    const find_member_query = `SELECT id, email, username, 
    pwd_hash, signup_token FROM members WHERE username = $1`
    return new Promise((resolve, reject) => {
        pool.query(find_member_query, [username])
            .then(res => {
                if(!res.rows[0]) return resolve(false)
                let member = res.rows[0]
                bcrypt.compare(password, member.pwd_hash, (err, res) => {
                    if(err) return reject(err)
                    if(res) {
                        delete member.pwd_hash
                        return resolve(member)
                    }
                    return resolve(false)
                })
            })
            .catch(err => reject(err))
    })
}

export async function create(options) {
    const create_member_query = `INSERT INTO members (id, email, username, 
        pwd_hash, signup_token) VALUES ($1, $2, $3, $4, $5) RETURNING id, 
        email, username, signup_token`
    return new Promise((resolve, reject) => {
        bcrypt.hash(options.password, 10, (err, hash) => {
            if(err) return reject(err)
            pool.query(create_member_query, [
                uuidv4(), options.email, options.username,
                hash, (shortid.generate()+shortid.generate())
            ])
            .then(res => resolve(res.rows[0]))
            .catch(err => reject(err))
        })
    })
}

export async function list(options) {}