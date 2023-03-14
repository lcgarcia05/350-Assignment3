var socket = io();
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

socket.on('connect', () => {
    console.log("connected to the server.")
});
socket.on('disconnect', () => {
    console.log("disconnected from the server.")
});

socket.on('newMessage', (message) => {
    console.log("newMessage", message);
    let li = document.createElement('li');
    li.innerText = `${message.from}: ${message.text}`
    document.querySelector('body').appendChild(li);
    message.value = ' ';
    
});

socket.on('room-created', (room) =>{
    const roomElement = document.createElement('div');
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`;
    roomLink.innerText = 'join';
    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
});


document.querySelector('#submit-btn').addEventListener('click', (e) => {
  e.preventDefault();

  socket.emit('createMessage', {
    from: "User",
    text: document.querySelector('input[name="message"]').value
  }, function(){

  });
});