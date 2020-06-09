var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var csrf = require('csurf');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var main = require('./views/main');
var mem_set = main;

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());

app.set('view engine', 'pug');
app.get('/', function(req, res) {
      res.render('index', { title: 'Meme market', message: 'Hello there!', memes: mem_set.get_top()});
});
  
app.get('/meme/:memeId', csrfProtection, function (req, res) {
    let meme = mem_set.get_meme(req.params.memeId);
    if (meme !== undefined) {
      res.render('meme', { meme: meme, csrfToken: req.csrfToken()} );
    }
    else {
      res.render('undefined');
    }
});
  
app.use(express.urlencoded({
    extended: true
    })); 
    app.post('/meme/:memeId', parseForm, csrfProtection, function (req, res) {
       let meme = mem_set.get_meme(req.params.memeId);
       let price = req.body.price;
       meme.change_price(price);
       res.render('meme', { meme: meme, csrfToken: req.csrfToken()})
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;