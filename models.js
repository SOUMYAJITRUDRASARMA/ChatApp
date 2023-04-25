const fs = require('fs')
let curIndex = 0

exports.userConnected = (currentUsers, idToUserMap, username, socketId) => {
    if(!currentUsers.hasOwnProperty(username)) {
        currentUsers[username] = {'status': 'online', 'socketid': socketId, 'unreadMessages': {}}
    }
    else {
        currentUsers[username]['status'] = 'online'
        currentUsers[username]['socketid'] = socketId
    }

    idToUserMap[socketId] = username
}

exports.userDisconnected = (currentUsers, idToUserMap, socketId) => {
    username = idToUserMap[socketId]
    if(currentUsers.hasOwnProperty(username)) {
        currentUsers[username] = {'status': 'offline', 'socketid': undefined,'unreadMessages': {}}
        console.log('lol');
    }

    if(idToUserMap.hasOwnProperty(socketId)) delete idToUserMap[socketId]
}

exports.saveMessage = (data, messages) => {
    sender = data['sender']
    receiver = data['receiver']
    message = data['message']
    time = data['time']
    upload = data['upload']
    uploadName = data['uploadName'].split('\\').pop()

    if(upload) {
        // effectiveUpload = '/static/uploads/' + time + '_' + uploadName
        extension = uploadName.split('.').pop()
        effectiveUpload = './static/uploads/' + (++curIndex) + '.' + extension
        fs.writeFileSync(effectiveUpload, upload)  // Overwrites if present
    } else effectiveUpload = undefined

    if(receiver == 'group') {
        messages['group'].push({'sender': sender, 'message': message, 'time': time, 'upload': effectiveUpload})
    }
    else {
        sender_receiver_id = generateSenderReceiverId(sender, receiver)
        if(!(sender_receiver_id in messages)) messages[sender_receiver_id] = []
        messages[sender_receiver_id].push({'sender': sender, 'message': message, 'time': time, 'upload': effectiveUpload})
    }

    return effectiveUpload
}

exports.saveMulticastMessage = (data, messages) => {
    sender = data['sender']
    receivers = data['receivers']
    message = data['message']
    time = data['time']
    upload = data['upload']
    uploadName = data['uploadName'].split('\\').pop()

    if(upload) {
        // effectiveUpload = '/static/uploads/' + time + '_' + uploadName
        extension = uploadName.split('.').pop()
        effectiveUpload = './static/uploads/' + (++curIndex) + '.' + extension
        fs.writeFileSync(effectiveUpload, upload)  // Overwrites if present
    } else effectiveUpload = undefined

    for(receiver of receivers)
    {    
        if(receiver == 'group') {
            messages['group'].push({'sender': sender, 'message': message, 'time': time, 'upload': effectiveUpload})
        }
        else {
            sender_receiver_id = generateSenderReceiverId(sender, receiver)
            if(!(sender_receiver_id in messages)) messages[sender_receiver_id] = []
            messages[sender_receiver_id].push({'sender': sender, 'message': message, 'time': time, 'upload': effectiveUpload})
        }
    }

    return effectiveUpload
}


generateSenderReceiverId = (sender, receiver) => {
    if(sender.localeCompare(receiver) < 0) return sender + '|' + receiver
    else return receiver + '|' + sender
}


exports.generateSenderReceiverId = generateSenderReceiverId