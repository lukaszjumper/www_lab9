var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var main = require('./views/main');
var mem_set = main;

app.set('view engine', 'pug');
app.get('/', function(req, res) {
      res.render('index', { title: 'Meme market', message: 'Hello there!', memes: mem_set.get_top()})
});
  
app.get('/meme/:memeId', function (req, res) {
    let meme = mem_set.get_meme(req.params.memeId);
    if (meme !== undefined) {
      res.render('meme', { meme: meme, })
    }
    else {
      res.render('undefined');
    }
});
  
app.use(express.urlencoded({
    extended: true
    })); 
    app.post('/meme/:memeId', function (req, res) {
       let meme = mem_set.get_meme(req.params.memeId);
       let price = req.body.price;
       meme.change_price(price);
       console.log(req.body.price);
       res.render('meme', { meme: meme })
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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