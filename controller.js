// Imports ...
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')


// Main Login Page ...
exports.login = (params) => (req, res) => {
    console.log('GET Body: ')
    res.status(200).render('index.ejs', params)
}

// Main Chat App Page ...
exports.dashboard = (params) => (req, res) => {
    username = req.body.username
    password = req.body.password

    if(password == params['adminPassword']) admin = true
    else admin = false
    
    console.log('Testing admin --> ', password, ' == ', params['adminPassword'], ' --> ', admin)

    res.status(200).render('dashboard.ejs', {username: username, admin: admin, currentUsers: params['currentUsers']})
}