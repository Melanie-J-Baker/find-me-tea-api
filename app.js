const express = require('express');
const createError = require('http-errors');
require('dotenv').config()
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require("express-rate-limit");
const cors = require('cors')
const indexRouter = require('./routes/find-me-tea');

const app = express();

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
const limiter = RateLimit({  // Set up rate limiter: max 20 reqs/min
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
app.use(limiter);  // Apply rate limiter to all reqs
app.use('/find-me-tea', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.json(err);
});

module.exports = app;