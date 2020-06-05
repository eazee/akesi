import pool from './pool'

pool.on('connect', () => console.log("connected to the database"))

async function createMembersTable() {
    const membersCreateQuery = `CREATE TABLE IF NOT EXISTS members 
    (id VARCHAR(60) PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    username VARCHAR(60) UNIQUE NOT NULL,
    pwd_hash VARCHAR(120) NOT NULL,
    signup_token VARCHAR(60),
    signup_done BOOLEAN DEFAULT FALSE)`
    return new Promise((resolve, reject) => {
        pool.query(membersCreateQuery)
            .then(res => {
                console.log('Table members has been created')
                resolve(res)
            })
            .catch(err => reject(err))
    })
}

async function dropMembersTable() {
    const membersDropQuery = 'DROP TABLE IF EXISTS members'
    return new Promise((resolve, reject) => {
        pool.query(membersDropQuery)
            .then(res => {
                console.log('Table members has been dropped.')
                resolve(res)
            })
            .catch(err => reject(err))
    })
}

export async function createAllTables() {
    await createMembersTable()
    pool.end()
}

export async function dropAllTables() {
    await dropMembersTable()
    pool.end()
}

pool.on('remove', () => console.log('client removed'))

import 'make-runnable'
