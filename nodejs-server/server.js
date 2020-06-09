'use strict';
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const Message = require('./models/Message');

const express = require('express');
const app = express();
const port = process.env.NS_PORT || 4000;

const server = require('http').Server(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://127.0.0.1/authy', { useNewUrlParser: true }, () => {
  console.log('connected')
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/register', (req, res) => {
  const newUser = new User();
  console.log(req.body);
  newUser.email = req.body.email;
  newUser.password =  bcrypt.hashSync( req.body.password, salt);
  newUser.save().then((userSaved) => {
    res.status(202).send(userSaved)
  }).catch(err => {
    res.send(`User was not send ${err}`);
  });
});

app.post('/login', (req, res) => {
  User.findOne({email: req.body.email}).then(user => {
        console.log(req.body.email, user);
        if(user){
          console.log('true');
          bcrypt.compare(req.body.password, user.password, (err, matched) => {
            if(err){
              console.log(err);
              return;
            }
            if(matched){
              res.status(202).send(user)
            } else {
              res.status(404).send('NOT LOGGED IN')
            }
          })
        }
      }
  ).catch( err => console.log(err))
});

server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.post('/message', (req, res) => {
  const message = new Message();
  console.log(req.body);
  message.message = req.body.message;
  message.author = req.body.author;
  message.authorName = req.body.authorName;
  message.save().then((messageSaved) => {
    res.status(202).send(messageSaved._id)
  }).catch(err => {
    res.send(`Message was not send ${err}`);
  });
});

io.on('connection', function (socket) {
  socket.on('refreshChat', function (data) {
    const getMessages = async() => {
      try{
        let messages =  await Message.find();
        return (messages);
      } catch (err){
        return(err);
      }
    }
    setInterval(async () => {
      const data = await getMessages();
      socket.emit('FromAPI', { data });
    }, 1000);
  });
});


app.get('/messages', async(req, res) => {
  try{
    const messages =  await Message.find();
    res.status(200).json(messages);
  } catch (err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});