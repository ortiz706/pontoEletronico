/**
 * Enviroment Variables Setup
 */
require('dotenv').config();

/**
 * Dependencies
 */
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const express = require('express');
const flash = require('express-flash');
const fs = require('fs');
const logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const schedule = require('node-schedule');
const session = require('express-session');

const { DateTime } = require('luxon');


/**
 * Functions
 */
const Email = require('./functions/email');
const Mandatory = require('./functions/mandatory');
const Sheets = require('./functions/sheets');

/**
* Models
*/
const Config = require('./models/config');
const Note = require('./models/note');

/**
 * Global variable
 */
const configJson = require('./config/config.json');

/**
 * Routes
 */
const adminRouter = require('./routes/admin');
const configRouter = require('./routes/config');
const indexRouter = require('./routes/index');
const noteRouter = require('./routes/note');
const roleRouter = require('./routes/roles');
const usersRouter = require('./routes/users');

/**
* Configuration Variables
*/
Config.get().then((config) => {
  global.config = config;
}).catch((error) => {
  console.log(error);
});

/**
* Load notes
*/
Note.get().then((note) => {
  fs.writeFile('./docs/notes.txt', note.text, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
}).catch((error) => {
  console.log(error);
});

/**
* Configuration cron job for reports
*/
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 6;
rule.hour = 22;
rule.minute = 00;
// rule.tz = 'America/Sao_Paulo';

const job = schedule.scheduleJob(rule, () => {
  console.log('Running scheduled job to generate reports!');
  Mandatory.getLastWeekReport().then((report) => {
    Sheets.writeReportGoogleSheets(report);
  }).catch((error) => {
    Email.errorEmail(error);
  });
});

/**
* Mongoose Setup
*/
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}/${process.env.MONGO_DATABASE}?${process.env.MONGO_OPTIONS}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database connected!');
  }).catch((error) => {
    console.log('Database connection failed!');
    console.log(error);
  });

/**
 * Application Initialization
 */
const app = express();

/**
 * View Engine Setup
 */
app.engine('hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  partialsDir: 'views/partials',
  helpers: {
    // Here we're declaring the #section that appears in layout/layout.hbs
    section(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },

    compare(lvalue, rvalue, options) {
      if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
      }

      const operator = options.hash.operator || '==';
      const operators = {
        '==': function(l, r) { return l == r; },
        '===': function(l, r) { return l === r; },
        '!=': function(l, r) { return l != r; },
        '<': function(l, r) { return l < r; },
        '>': function(l, r) { return l > r; },
        '<=': function(l, r) { return l <= r; },
        '>=': function(l, r) { return l >= r; },
        'typeof': function(l, r) { return typeof l == r; }
      }
      if (!operators[operator]) {
        throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);
      }
      const result = operators[operator](lvalue, rvalue);
      if (result) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Application Configuration
 */
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'some-private-cpe-key',
  resave: true,
  saveUninitialized: true
}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/config', configRouter);
app.use('/notes', noteRouter);
app.use('/roles', roleRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
