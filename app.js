var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var csrf = require('csurf');
var bodyParser = require('body-parser')
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var main = require('./views/main');
var mem_set = main;

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());
app.use(session(
  {
    store: new SQLiteStore,
    cookie: { maxAge: 15 * 60 * 1000 },
    secret: "kPjOmQISN",
    resave: true,
    saveUninitialized: true
  }));

app.set('view engine', 'pug');
app.get('/', function(req, res) {
  mem_set.get_top((top) => {
      if(req.session.page_views){
        req.session.page_views++;
      } else {
        req.session.page_views = 1;
      }
      res.render('index', { title: 'Meme market', message: 'Hello there!', memes: top, sites: req.session.page_views});
  });
});
  
app.get('/meme/:memeId', csrfProtection, function (req, res) {
    if(req.session.page_views){
      req.session.page_views++;
    } else {
      req.session.page_views = 1;
    }
    mem_set.get_meme(req.params.memeId, (meme) => {
    if (meme !== undefined) {
      res.render('meme', { meme: meme, csrfToken: req.csrfToken(), sites: req.session.page_views} );
    }
    else {
      res.render('undefined', {sites: req.session.page_views});
    }
  });
});
  
app.use(express.urlencoded({
    extended: true
}));

app.post('/meme/:memeId', parseForm, csrfProtection, function (req, res) {
  if(req.session.page_views){
    req.session.page_views++;
  }
  else {
    req.session.page_views = 1;
  }
  if (req.session.user) {
    let price = req.body.price;
    mem_set.change_price(req.params.memeId, price, req.session.user.id, () => {
      mem_set.get_meme(req.params.memeId, (meme) => {
        res.render('meme', { meme: meme, csrfToken: req.csrfToken(), sites: req.session.page_views});
      }); 
    });
  }
  else {
    mem_set.get_meme(req.params.memeId, (meme) => {
      res.render('meme', { meme: meme, csrfToken: req.csrfToken(), sites: req.session.page_views, message: "Nie jesteś zalogowany"});
    });
  }
});

app.get('/signup', csrfProtection, function (req, res) {
  if(req.session.page_views){
    req.session.page_views++;
  } else {
    req.session.page_views = 1;
  }
  res.render('signup', {csrfToken: req.csrfToken(), sites: req.session.page_views});
});

app.post('/signup', parseForm, csrfProtection, function (req, res) {
  if(req.session.page_views){
    req.session.page_views++;
  } else {
    req.session.page_views = 1;
  }
  mem_set.exists(req.body.id, (exists) => {
    if (exists) {
      res.render('signup', {message: "Użytkownik już istnieje", csrfToken: req.csrfToken(), sites: req.session.page_views});
    }
    else {
      mem_set.new_user(req.body.id, req.body.password, () => {
        req.session.user = {id: req.body.id, password: req.body.password};
        res.redirect('/');
      });
    }
  });
});

app.get('/login', csrfProtection, function(req, res){
  if(req.session.page_views){
    req.session.page_views++;
  } else {
    req.session.page_views = 1;
  }
  res.render('login', {csrfToken: req.csrfToken(), sites: req.session.page_views});
});

app.post('/login', parseForm, csrfProtection, function(req, res){
  if(req.session.page_views){
    req.session.page_views++;
  } else {
    req.session.page_views = 1;
  }
  mem_set.check(req.body.id, req.body.password, (ok) => {
    if (ok) {
      req.session.user = {id: req.body.id, password: req.body.password};
      res.redirect('/');
    }
    else {
      res.render('login', {message: "Niepoprawne dane", csrfToken: req.csrfToken(), sites: req.session.page_views});
    }
  });
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){
     console.log("user logged out.")
  });
  res.redirect('/login');
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