require('dotenv').config()
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator =require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
// mongoose.connect(config.database);
// let db = mongoose.connection;





//MongoDB
const mongo = require('./routes/articles')
app.use(mongo)

// Check connection
// const db = mongoose.connection
// db.on('error', () => console.log('Database connection error'))
// db.once('open', () => console.log('Database connected'))


// Bring in Models
let Article = require('./models/article');
//local View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// parse application/json
app.use(bodyParser.json())

//Set Public Floder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get('/', function(req,res){
  Article.find({}, function(err,articles){
    if(err){
      console.log(err);
    }else{
      res.render('home-login',{
        title:'Articles',
        articles: articles

      });
    }
  })
});

//Route Files
let articles =require('./routes/articles');
let users =require('./routes/users');
let profiles =require('./routes/profiles');

app.use('/articles', articles);
app.use('/users', users);
app.use('/profiles', profiles);
//Start Server
app.listen(2000,function(){
  console.log('Server started on port 2000...')
})
