const util = require('util');

function InputError(message) {
  this.message = message;
  Error.captureStackTrace(this, InputError);
}
util.inherits(InputError, Error);
InputError.prototype.name = 'InputError';

function InternalError(message) {
  this.message = message;
  Error.captureStackTrace(this, InternalError);
}
util.inherits(InternalError, Error);
InternalError.prototype.name = 'InternalError';


module.exports = {
  InputError,
  InternalError,
};
