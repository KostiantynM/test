require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const routes = require('./routes/');
const app = express();
const apiLimiter = rateLimit({
  windowMs: 1e4,
  max: 5,
  message: 'to many requests'
});

app.use(bodyParser.json());
app.use('/api/v1', apiLimiter);
app.use('/api/v1', routes);

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});
