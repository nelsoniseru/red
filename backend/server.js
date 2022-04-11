var createError = require('http-errors');
var express = require('express');
var http = require('http')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

require('dotenv').config({ path: './.env' })
require('./database/db')

var cryptoRouter = require('./routes/crypto');

var app = express()
const port = process.env.PORT
const server = http.createServer(app)
server.listen(port, () => { console.log("app listening on port " + port) });

//socket.io configuration
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});


// establishing a socket.io connection checking to see if a client talks to the server in real time
io.on('connection', (socket) => {
  console.log('A user is connected');

  socket.on('message', (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  })

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected`);
  })
})
app.use(logger(process.env.DEV));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//making socket available to my routes
app.use(function (req, res, next) {
  req.io = io
  next()
})
app.use('/api', cryptoRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

});






