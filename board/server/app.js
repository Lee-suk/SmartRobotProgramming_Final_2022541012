var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// express-mysql-session
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
// 데이터 베이스에 접근하기 위한 접근 정보
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'itc801',
  database: 'board'
};
var sessionStore = new MySQLStore(options);
//

// sequelize 
const { Sequelize } = require('sequelize');

global.sequelize = new Sequelize('board', 'root', 'itc801', {
  host: 'localhost',
  dialect: "mysql",
  logging: false      // 로그 정리
});

require("./model.js")
//

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var BoardRouter = require('./routes/board');

var app = express();

// 인증에 대한 정보를 여기다가 저장하겠다.
app.use(session({
  key: 'session_Unique_key', // 독특한 값을 넣어 겹치지 않게
  secret: 'sdfkkjilzgjdlkceasdfasdfsdfas', // 암호화 알고리즘 비교 + 표준화된게 있기 때문에 솔트를 붙여 사용
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/board', BoardRouter);

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
  res.render('error');
});

module.exports = app;
