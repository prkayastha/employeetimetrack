var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');

var routes = require('./routes/index');
var users = require('./routes/users');
var passwords = require('./routes/password');
var auth = require('./routes/authenticate');
var token = require('./controller/authenticate/token');
const trello = require('./routes/trelloRoute');
const project = require('./routes/project');
const task = require('./routes/task');
const time = require('./routes/time');
const workdiary = require('./routes/workdiary');
const errorHandler = require('./controller/errorHandler');
var app = express();

var db = require('./models');

const noAuthRoute = [
    '/',
    '/auth/check',
    '/user/register',
    '/trello/api/oauth/requestToken',
    /\/trello\/oauth\/callbackUrl\/*/,
    /\/password\/*/,
    /\/public\/*/
];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/capture', express.static(path.join(__dirname, 'public/captures')));
app.use(cors());

db.sync();

app.use(token.checkToken.unless({ path: noAuthRoute }));
app.use('/', routes);
app.use('/user', users);
app.use('/password', passwords);
app.use('/auth', auth);
app.use('/trello', trello);
app.use('/project', project);
app.use('/task', task);
app.use('/time', time);
app.use('/workdiary', workdiary);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        return errorHandler(res, err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    return errorHandler(res, err);
});


module.exports = app;
