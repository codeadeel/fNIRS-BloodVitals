// Importing Libraries
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var cors = require('cors');

// Initialize the authentication route
const {loginHandler, jwtKey} = require('./routes/loginRoute');

// Initialize the backend app
const app = express();
const server = createServer(app);
const io = new Server(server);

// Gracefull Shutdown
process.on('SIGINT', () => {
    console.log('Shutting Down ...');
    process.exit(0);
});

// Initizalion of socker & relevant events
io.on('connection', (socket) => {
    console.log('[ SocketIO : CONNECTION ] : Client Connected');

    // msg: {"A0": someValue, "A1": someValue}
    // Raw Sensor Value
    socket.on('serverMSGA', (msg)=>{
        socket.broadcast.emit('upMSGA', msg);
    });

    // Delta A
    socket.on('serverMSGdeltaA', (msg)=>{
        socket.broadcast.emit('upMSGdeltaA', msg);
    });

    // Concentration Value
    socket.on('serverMSGC', (msg)=>{
        socket.broadcast.emit('upMSGC', msg);
    });

    // Concentration @ High Pass Filter Value
    socket.on('serverMSGCHP', (msg)=>{
        socket.broadcast.emit('upMSGCHP', msg);
    });

    // Tissue Saturation Index
    socket.on('serverMSGTSI', (msg)=>{
        socket.broadcast.emit('upMSGTSI', msg);
    });
});

// Initialize express middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// Define authentication route for login
app.use('/api/auth', loginHandler);


// Server the frontend app
app.use("/", express.static(`${__dirname}/dist`));

app.get('/*', (req, res)=>{
    res.sendFile(join(__dirname, 'dist/index.html'));
});

// Start the main server
server.listen(80, ()=>{
    console.log('Express Server Running');
});
