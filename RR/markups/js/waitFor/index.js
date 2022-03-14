var waitFor = function (exitCondition, callback, force, opts) {
  var checkCount = (opts && opts.checkCount) || 100;
  var timeout = (opts && opts.timeout) || 1000;

  (function check() {
    var result = exitCondition();
    if (result) {
      callback(result);
      return;
    }

    if (checkCount === 0) {
      if (force) {
        callback();
      }
      return;
    }

    checkCount -= 1;
    setTimeout(check, timeout);
  }());
};


// для теста
module.exports = waitFor;
