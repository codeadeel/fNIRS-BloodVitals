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
var expressPort = process.env.PORT;
if(expressPort==undefined){
    console.log('[ ENV: PORT ] : PORT not set, ( Default : 80 )')
    expressPort = 80;
} else {
    console.log(`[ ENV: PORT ] : ${expressPort}`)
    
}

// Initialize the database route
const {databaseHandler} = require('./routes/databaseRoute');

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

    // msg: {"870nm": someValue, "940nm": someValue, "1200nm": someValue, "1550nm": someValue}
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

    // Device ID
    socket.on('serverDevID', (msg)=>{
        socket.broadcast.emit('devID', msg);
    });
});

// Initialize express middlewares
app.use(cookieParser());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(cors());

// Define authentication route for login
app.use('/api/auth', loginHandler);

// Define databse route for data handling
app.use('/api/database', databaseHandler);

// Server the frontend app
app.use("/", express.static(`${__dirname}/dist`));

app.get('/*', (req, res)=>{
    res.sendFile(join(__dirname, 'dist/index.html'));
});

// Start the main server
server.listen(expressPort, ()=>{
    console.log('Express Server Running');
});
