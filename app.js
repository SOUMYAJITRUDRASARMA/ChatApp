// Imports ...
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const controller = require('./controller')
const http = require('http')
const socketio = require('socket.io')


// Functional Imports ...
const { userConnected, userDisconnected, saveMessage, saveMulticastMessage, generateSenderReceiverId } = require('./models')


// Making app ...
const app = express()
const port = 80
const params = { }

const server = http.createServer(app);
const io = socketio(server, {maxHttpBufferSize: 1e8})  // 100MB Max Transfer Size ...


// EXPRESS SPECIFIC SETUP
app.use('/static', express.static('static'))  // for serving static files
app.use(express.urlencoded())  // It parses incoming requests with urlencoded payloads and is based on body-parser, for POST methods


// PUG SPECIFIC SETUP
app.set('view engine', 'ejs')  // set the template engine as ejs
app.set('views', path.join(__dirname, 'views'))  // set the views directory


// SOCKET IO LOGIC ...
currentUsers = { }
messages = { 'group': [ ] }
idToUserMap = { }

io.on('connection', (socket) => {
    // console.log('Client connected ...')
    socket.on('join', (username) => {
        // console.log(data)
        userConnected(currentUsers, idToUserMap, username, socket.id)
        console.log('JOIN ->  ', currentUsers, '\n', idToUserMap)
        socket.broadcast.emit('user-connect-notification', username)
    })

    socket.on('disconnect', (reason) => {
        // console.log(data)
        disconnectedUsername = idToUserMap[socket.id]
        userDisconnected(currentUsers, idToUserMap, socket.id)
        console.log('DISCONNECT ->  ', currentUsers, '\n', idToUserMap)
        if(disconnectedUsername != undefined) {
            socket.broadcast.emit('user-disconnect-notification', disconnectedUsername)
        }
    })

    socket.on('message_sent', (data) => {
        console.log('Message Transfer', data)
        if(data['upload']) console.log('Typeof file -> ', typeof data['upload'])
        data['upload'] = saveMessage(data, messages)

        if(data['receiver'] == 'group') io.sockets.emit('message_received', data)  // socket.broadcast.emit('message_received', data)
        else { 
            receiverSocketId = currentUsers[data['receiver']]['socketid']
            console.log('receiverSocketId: ', receiverSocketId, 'info: ', data['receiver'], currentUsers[data['receiver']])
            socket.emit('message_received', data)  // Sender ...
            if(receiverSocketId != undefined) {
                // Unicast ...
                receiverSocket = io.sockets.sockets.get(receiverSocketId)
                receiverSocket.emit('message_received', data)  // Receiver ...
            }
        }

        console.log('Messages -> ', messages)
    })

    socket.on('multicast_message_sent', (data) => {
        console.log('Message Transfer', data)
        if(data['upload']) console.log('Typeof file -> ', typeof data['upload'])
        data['upload'] = saveMulticastMessage(data, messages)

        receivers = data['receivers']
        data['receivers'] = undefined
        for(receiver of receivers)
        {
            data['receiver'] = receiver
            
            if(data['receiver'] == 'group') io.sockets.emit('message_received', data)  // socket.broadcast.emit('message_received', data)
            else { 
                receiverSocketId = currentUsers[data['receiver']]['socketid']
                console.log('receiverSocketId: ', receiverSocketId, 'info: ', data['receiver'], currentUsers[data['receiver']])
                socket.emit('message_received', data)  // Sender ...
                if(receiverSocketId != undefined) {
                    // Unicast ...
                    receiverSocket = io.sockets.sockets.get(receiverSocketId)
                    receiverSocket.emit('message_received', data)  // Receiver ...
                }
            }
        }

        console.log('Messages -> ', messages)
    })

    socket.on('message_delete', (data) => {
        id = data['id']
        if(id < messages['group'].length) {
            messages['group'][id]['message'] = '-- DELETED BY ADMIN --'
            messages['group'][id]['upload'] = undefined
        }

        io.sockets.emit('message_delete_notification', data)
    })

    socket.on('get_messages_from_server', (data) => {
        console.log('==> Requesting Message Data: ', data)
        sender = data['sender']
        receiver = data['receiver']

        if(receiver == 'group') {
            socket.emit('receive-message-from-server', messages['group'])
        }
        else {
            dataToSend = []
            sender_receiver_id = generateSenderReceiverId(sender, receiver)
            if(messages.hasOwnProperty(sender_receiver_id)) dataToSend = messages[sender_receiver_id]
            socket.emit('receive-message-from-server', dataToSend)
        }
    })
})


// ENDPOINTS
app.get('/', controller.login(params))
app.post('/dashboard', controller.dashboard({'currentUsers': currentUsers, 'adminPassword': 'admin'}))


// START THE SERVER
// To make your server run on different devices -> make network type private to be discoverable on the network ...
server.listen(port, () => {
    console.log("The application started successfully on port " + port)
})