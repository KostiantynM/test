module.exports = function CustomError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.customMessage = message;
  this.extra = Object.keys(extra).reduce((accum, key) => {
    if (extra[key] != null) {
      accum[key] = extra[key];
    }
    return accum;
  }, Object.create(null));
  if (process.env.ENV === 'production') {
    this.stack = null;
  }
};

require('util').inherits(module.exports, Error);
