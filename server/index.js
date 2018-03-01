const express = require('express');
const path = require('path');
const session = require('express-session');

const bodyParser = require('body-parser');
const db = require('../database/index');
let app = express();

let PORT = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'This is our secret',
  resave: false,
  saveUninitialized: true
}));

app.route('/login')
   .post((req, res) => {
    console.log('getting user from database:', req.body);

    db.getUser(req.body, (err, result) => {
      if (err) { res.status(500).send(err); }
      else {
        console.log('got user data from the db:', result);
        res.send(result);
      }
    });
});

app.route('/checkuser')
   .post((req, res) => {

    db.checkUser(req.body, function(err, result) {
      if (err) {
        res.status(500).send({ error: 'Error checking username' });
      } else {
        res.send(result);
      }
    });
});

app.route('/signup')
   .post((req, res) => {
    console.log('posting new user to db:', req.body);

    db.saveUser(req.body, (err, result) => {
      if (err) {
        console.log('error saving user data to db:', err);
        res.status(500).send({ error: 'User already exists' });
      }
      else {
        console.log('saved user data to the db:', result);
        res.send(result);
      }
    });
});


app.route('/*')
   .get((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});
