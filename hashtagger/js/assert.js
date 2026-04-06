// from: http://aymanh.com/9-javascript-tips-you-may-not-know/#assertion
function AssertException(message) {
    this.message = message;
}

AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}
