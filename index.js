const express = require("express");
const passport = require('passport');
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload")
const PUBLIC_DIR = "public";
const STATIC_DIR = "static";
const timeout = require('connect-timeout')


const app = express();
app.use(timeout('15s'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.use(express.static(STATIC_DIR));
app.use(express.static(PUBLIC_DIR));


app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.send({ message: 'Super secret code is ABC123' });
});

require("./routes/main")(app);

const PORT = process.env.PORT || 909;
const server = app.listen(PORT);

