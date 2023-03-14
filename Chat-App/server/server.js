const path  = require('path');
const express = require('express');
const socketIO= require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const viewsPath = path.join(__dirname, '/../views');
const app = express();
const server = app.listen(3000, () => {
    console.log("Server started...")
});

app.use(express.static(publicPath));

const io = socketIO.listen(server);

app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

const rooms = {name: {}};


app.get('/', (req, res) => {
    res.render('index', {rooms: rooms});
});

app.post('/room', (req, res) => {
    if (rooms[req.body.room] != null){
        return res.redirect('/');
    }
    rooms[req.body.room] = {user: {}};
    res.redirect(req.body.room);
    io.emit('room-created', req.body.room);
});

app.get('/:showroom', (req, res) => {
    res.send('hi');
});

app.get('/:room', (req, res) => {
    res.render('room', {roomName: req.params.room})
});

io.on('connection', (socket) =>{
    console.log("A new user just connected");

    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome the chat room",
    });

    socket.broadcast.emit('newMessage', {
        from: "Admin",
        text: "user joined",
    });
    
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
        });
    });
    
    socket.on('connect', () => {
        console.log('User connected');
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

});