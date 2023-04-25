console.log('From script.js: ' + username + ' , ' + admin)
console.log('Type: ' + typeof username)
console.log(currentUsers)

var currentChatUser = 'group'
var messageList = []
var selectedMulticastUsers = []
var unseenMessagesCount = { }

const imgExtList = ['apng', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg']
const videoExtList = ['mp4', 'webm']
const audioExtList = ['mp3', 'wav']

userList = document.getElementById('userlist')
chatList = document.getElementById('chatlist')
currentChatUserElement = document.getElementById('current-chat-user')
currentChatUserProfilePicElement = document.getElementById('current-chat-user-profile-pic')
messageElement = document.getElementById('message-element')
uploadElement = document.getElementById('upload-element')
mainChatMenu = document.getElementById('main-chat-menu')

multicastMenu = document.getElementById('multicast-menu')
multicastUserList = document.getElementById('multicast-userlist')
multicastChatContentElement = document.getElementById('multicast-chat-content')

// for(let x in userList.children)
//     console.log(x)
// console.log(userList.children)


formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

updateUserListView = () => {
    userList.innerHTML = ''  // Cleaning list for reconstruction ...

    elemDiv = document.createElement('div')
    if(unseenMessagesCount.hasOwnProperty('group') && unseenMessagesCount['group'] > 0) elemDiv.innerHTML = '<a onclick="selectUserToChat(\'group\')" id="chat-group" class="list-group-item list-group-item-action border-0"><div class="badge bg-success float-right">' + unseenMessagesCount['group'] + '</div><div class="d-flex align-items-start">    <img src="../static/images/group.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">    <div class="flex-grow-1 ml-3">        Group Chat        <div class="small"><span class="fas fa-circle chat-online"></span> @Everyone</div>    </div></div></a>'
    else elemDiv.innerHTML = '<a onclick="selectUserToChat(\'group\')" id="chat-group" class="list-group-item list-group-item-action border-0"><div class="d-flex align-items-start">    <img src="../static/images/group.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">    <div class="flex-grow-1 ml-3">        Group Chat        <div class="small"><span class="fas fa-circle chat-online"></span> @Everyone</div>    </div></div></a>'
    userList.appendChild(elemDiv)
    for(let user in currentUsers) if(user != username) {
        elemDiv = document.createElement('div')
        if(unseenMessagesCount.hasOwnProperty(user) && unseenMessagesCount[user] > 0) elemDiv.innerHTML = '<a onclick="selectUserToChat(\'' + user + '\')" id="chat-' + user + '" class="list-group-item list-group-item-action border-0"><div class="badge bg-success float-right">' + unseenMessagesCount[user] + '</div><div class="d-flex align-items-start">    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">    <div class="flex-grow-1 ml-3">' + user + '<div class="small"><span class="fas fa-circle chat-online"></span> ' + currentUsers[user]['status'] + '</div>    </div></div></a>'
        else elemDiv.innerHTML = '<a onclick="selectUserToChat(\'' + user + '\')" id="chat-' + user + '" class="list-group-item list-group-item-action border-0"><div class="d-flex align-items-start">    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">    <div class="flex-grow-1 ml-3">' + user + '<div class="small"><span class="fas fa-circle chat-online"></span> ' + currentUsers[user]['status'] + '</div>    </div></div></a>'
        userList.appendChild(elemDiv)
            // console.log(user, currentUsers[user])
    }
}


updateMessageListView = () => {
    currentChatUserElement.innerHTML = currentChatUser
    if(currentChatUser == 'group') currentChatUserProfilePicElement.innerHTML = '<img src="../static/images/group.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">'
    else currentChatUserProfilePicElement.innerHTML = '<img src="https://bootdey.com/img/Content/avatar/avatar3.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">'

    chatList.innerHTML = ''
    for(var message in messageList) {
        console.log('** Updating view -> ', message)
        updateMessageListViewWithSingleMessage(messageList[message]['sender'], messageList[message]['message'], messageList[message]['upload'], messageList[message]['time'], message)
    }

    chatList.scrollTop = chatList.scrollHeight
}


updateMessageListViewWithSingleMessage = (sender, message, upload, time, id) => {
    if(upload) extension = upload.split('.').pop()
    console.log('--> In update fn: time = ', time);
    if(upload) console.log('Extension = ', extension, ' , Result: ', imgExtList.includes(extension))

    elemDiv = document.createElement('div')
    if(admin && currentChatUser == 'group' && message != '-- DELETED BY ADMIN --') {
        if(sender == username) {
            if(upload) {
                if(imgExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><img src="' + upload + '" style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'

                else if(videoExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><video src="' + upload + '" controls style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'
                
                else if(audioExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><audio src="' + upload + '" controls style="width:100%; max-width:600px; min-width:300px;"></div>' + message + '</div></div></div>'

                else elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><a href="' + upload + '" download><button class="btn-success" style="transition: 0.2s; float: right; padding-left: 10px; padding-right: 10px;">Download (' + extension + ')</button></a></div>' + message + '</div></div></div>'
            }
            else elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '">' + message + '</div></div></div>'
        }
        else {
            if(upload) {
                if(imgExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><img src="' + upload + '" style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'

                else if(videoExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><video src="' + upload + '" controls style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'
                
                else if(audioExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><audio src="' + upload + '" controls style="width:100%; max-width:600px; min-width:300px;"></div>' + message + '</div></div></div>'

                else elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><a href="' + upload + '" download><button class="btn-success" style="transition: 0.2s; float: right; padding-left: 10px; padding-right: 10px;">Download (' + extension + ')</button></a></div>' + message + '</div></div></div>'
            }
            else elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img id="img' + id + '" onclick="deleteMessage(' + id + ')" src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '">' + message + '</div></div></div>'
        }
    }
    else {
        if(sender == username) {
            if(upload) {
                if(imgExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><img src="' + upload + '" style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'
    
                else if(videoExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><video src="' + upload + '" controls style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'
                
                else if(audioExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><audio src="' + upload + '" controls style="width:100%; max-width:600px; min-width:300px;"></div>' + message + '</div></div></div>'
    
                else elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '"><div><a href="' + upload + '" download><button class="btn-success" style="transition: 0.2s; float: right; padding-left: 10px; padding-right: 10px;">Download (' + extension + ')</button></a></div>' + message + '</div></div></div>'
            }
            else elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">    <div class="font-weight-bold mb-1">Me</div><div id="msg' + id + '">' + message + '</div></div></div>'
        }
        else {
            if(upload) {
                if(imgExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><img src="' + upload + '" style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'
    
                else if(videoExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><video src="' + upload + '" controls style="width:100%; max-width:600px;"></div>' + message + '</div></div></div>'
                
                else if(audioExtList.includes(extension)) elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><audio src="' + upload + '" controls style="width:100%; max-width:600px; min-width:300px;"></div>' + message + '</div></div></div>'
    
                else elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '"><div><a href="' + upload + '" download><button class="btn-success" style="transition: 0.2s; float: right; padding-left: 10px; padding-right: 10px;">Download (' + extension + ')</button></a></div>' + message + '</div></div></div>'
            }
            else elemDiv.innerHTML = '<div class="chat-message-left pb-4"><div>    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">    <div class="text-muted small text-nowrap mt-2">' + time + '</div></div><div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">    <div class="font-weight-bold mb-1">' + sender + '</div><div id="msg' + id + '">' + message + '</div></div></div>'
        }
    }
    chatList.appendChild(elemDiv)
    chatList.scrollTop = chatList.scrollHeight

    // <a href="' + upload + '" download><button class="btn-success" style="transition: 0.2s; float: right; padding-left: 10px; padding-right: 10px;">Download (' + extension + ')</button></a>

    /* 
        Format of sent and received messages ->
            <div class="chat-message-right pb-4">
                <div>
                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
                    <div class="text-muted small text-nowrap mt-2">2:33 am</div>
                </div>
                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                    <div class="font-weight-bold mb-1">You</div>
                    Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.
                </div>
            </div>
    
            <div class="chat-message-left pb-4">
                <div>
                    <img src="https://bootdey.com/img/Content/avatar/avatar3.png" class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">
                    <div class="text-muted small text-nowrap mt-2">2:34 am</div>
                </div>
                <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                    <div class="font-weight-bold mb-1">Sharon Lessman</div>
                    Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.
                </div>
            </div>
    */
}


updateMessageListFromServer = () => {
    // messageList = []
    socket.emit('get_messages_from_server', {'sender': username, 'receiver': currentChatUser})
}


selectUserToChat = (user) => {
    console.log('Selected -->', user);
    if(currentChatUser != user) {
        if(unseenMessagesCount.hasOwnProperty(user)){ 
            unseenMessagesCount[user] = 0
            updateUserListView()
        }
        currentChatUser = user
        updateMessageListFromServer()
    }
}


sendMessage = () => {
    var messageToSend = messageElement.value.trim()
    var uploadToSend = uploadElement.files[0]
    var uploadName = uploadElement.value
    messageElement.value = ''
    // console.log('upload:', uploadElement.files)
    // console.log('uploadValue:', uploadElement.value)
    uploadElement.value = ''
    // uploadElement.files.length = 0
    // delete uploadElement.files[0]
    // console.log('uploadNext:', uploadElement.files)
    // console.log('uploadValueNext:', uploadElement.value)

    console.log('message:', messageToSend)
    console.log('upload:', uploadToSend)
    time = formatAMPM(new Date())
    if(messageToSend) {
        socket.emit('message_sent', {'sender': username, 'receiver': currentChatUser, 'message': messageToSend, 'time': time, 'upload': uploadToSend, 'uploadName': uploadName})
        // updateMessageListViewWithSingleMessage(username, messageToSend, time)
    }
    else alert('Cannot send empty message !!!')
}


deleteMessage = (id) => {
    if(confirm('Are you sure you want to delete this message ?')) {
        console.log('Requesting delete --> ', id)
        socket.emit('message_delete', {'id': id})
    }
}


updateMulticastUserList = () => {
    multicastUserList.innerHTML = ''  // Cleaning list for reconstruction ...

    elemDiv = document.createElement('div')
    elemDiv.innerHTML = '<a onclick="toggleMulticastUser(\'group\')" id="multicast-group" class="list-group-item list-group-item-action border-0"><div class="d-flex align-items-start">    <img src="../static/images/group.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">    <div class="flex-grow-1 ml-3">        Group Chat        <div class="small"><span class="fas fa-circle chat-online"></span> @Everyone</div>    </div></div></a>'
    multicastUserList.appendChild(elemDiv)

    for(let user in currentUsers) if(user != username) {
        elemDiv = document.createElement('div')
        elemDiv.innerHTML = '<a onclick="toggleMulticastUser(\'' + user + '\')" id="multicast-' + user + '" class="list-group-item list-group-item-action border-0"><div class="d-flex align-items-start">    <img src="https://bootdey.com/img/Content/avatar/avatar5.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">    <div class="flex-grow-1 ml-3">' + user + '<div class="small"><span class="fas fa-circle chat-online"></span> ' + currentUsers[user]['status'] + '</div>    </div></div></a>'
        multicastUserList.appendChild(elemDiv)
    }
}


updateMulticastContentsView = () => {
    multicastChatContentElement.innerHTML = ''
    elemDiv = document.createElement('div')

    var messageToSend = messageElement.value.trim()
    var uploadName = uploadElement.value
    if(uploadName) var actualFilePath = uploadElement.files[0]

    console.log('Multicast View -> ', actualFilePath)

    if(uploadName) elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3"><div>Uploading: <a href="' + '#' + '" target="_blank">' + uploadName.split('\\').pop() + '</a></div>' + messageToSend + '</div></div>'
    else elemDiv.innerHTML = '<div class="chat-message-right pb-4"><div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">' + messageToSend + '</div></div>'

    multicastChatContentElement.appendChild(elemDiv)
}


toggleMulticastUser = (user) => {
    if(selectedMulticastUsers.includes(user)) {
        selectedMulticastUsers = selectedMulticastUsers.filter(e => e != user)
        document.getElementById('multicast-' + user).style.backgroundColor = 'white'
    } else {
        selectedMulticastUsers.push(user)
        document.getElementById('multicast-' + user).style.backgroundColor = '#ADD8E6'
    }

    console.log('Current Selected Multicast User -> ', selectedMulticastUsers)
}


displayMulticastMenu = () => {
    var messageToSend = messageElement.value.trim()
    if(messageToSend) {
        updateMulticastUserList()
        updateMulticastContentsView()
        selectedMulticastUsers = []

        mainChatMenu.style.display = 'none'
        multicastMenu.style.display = 'block'
    } else alert('Cannot multicast empty message !!!')
}


hideMulticastMenu = () => {
    mainChatMenu.style.display = 'block'
    multicastMenu.style.display = 'none'
}


sendMulticastMessage = () => {
    var messageToSend = messageElement.value.trim()
    var uploadToSend = uploadElement.files[0]
    var uploadName = uploadElement.value
    messageElement.value = ''
    uploadElement.value = ''

    console.log('multicast message:', messageToSend)
    console.log('multicast upload:', uploadToSend)
    time = formatAMPM(new Date())

    hideMulticastMenu()

    // Message To Send is checked earlier ...
    socket.emit('multicast_message_sent', {'sender': username, 'receivers': selectedMulticastUsers, 'message': messageToSend, 'time': time, 'upload': uploadToSend, 'uploadName': uploadName})
}


// Join chatroom
socket.on('connect', (data) => {
    socket.emit('join', username)
})

socket.on('user-connect-notification', (connectedUsername) => {
    console.log('--> Connected:', connectedUsername)
    if(connectedUsername in currentUsers) {
        currentUsers[connectedUsername]['status'] = 'online'
        userList.innerHTML = ''  // Cleaning list for reconstruction ...
    }
    else {
        currentUsers[connectedUsername] = {'status': 'online', 'unreadMessages': {}}
    }

    updateUserListView()
})

socket.on('user-disconnect-notification', (disconnectedUsername) => {
    console.log('--> Disconnected:', disconnectedUsername)
    if(disconnectedUsername in currentUsers) {
        currentUsers[disconnectedUsername]['status'] = 'offline'
        updateUserListView()
    }
})

socket.on('message_received', (data) => {
    sender = data['sender']
    receiver = data['receiver']
    message = data['message']
    time = data['time']
    upload = data['upload']

    console.log('--> Message Received: ', data)

    if(receiver == 'group') {
        if(currentChatUser == 'group') {
            updateMessageListViewWithSingleMessage(sender, message, upload, time, messageList.length)
            messageList.push(undefined)
        } else {
            if(!unseenMessagesCount.hasOwnProperty('group')) unseenMessagesCount['group'] = 1
            else unseenMessagesCount['group'] += 1
            updateUserListView()
        }
    }
    else {
        if(currentChatUser == sender || currentChatUser == receiver) {
            updateMessageListViewWithSingleMessage(sender, message, upload, time, messageList.length)
            messageList.push(undefined)
        } else {
            if(!unseenMessagesCount.hasOwnProperty(sender)) unseenMessagesCount[sender] = 1
            else unseenMessagesCount[sender] += 1
            updateUserListView()
        }
    }
})

socket.on('message_delete_notification', (data) => {
    if(currentChatUser == 'group') {
        id = data['id']
        if(id < messageList.length) {
            document.getElementById('msg' + id).innerHTML = '-- DELETED BY ADMIN --'
            if(admin) document.getElementById('img' + id).setAttribute('onclick', 'undefined')
        }
    }
    else ;
})

socket.on('receive-message-from-server', (data) => {
    console.log('==> Received: ', data)
    messageList = data
    updateMessageListView()
})


updateUserListView()
updateMessageListFromServer()
updateMessageListView()

if(admin) alert('You are in admin mode !!!')