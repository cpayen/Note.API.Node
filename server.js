require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('middlewares/jwt');
const errorHandler = require('middlewares/errors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/user', require('app/user/user.controller'));
app.use('/hello', require('app/hello/hello.controller'));
app.use('/notes', require('app/notes/notes.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
  console.log('Server listening on port ' + port);
});