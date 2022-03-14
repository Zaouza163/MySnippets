
var waitFor = function (exitCondition, callback, force) {
  var checkCount = 100;
  var timeout = 1000;

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

waitFor(
  function () {
    return ('ga' in window && 'getAll' in window.ga);
  },
  function () {
    var trackerName = ga.getAll()[0].get('name');

    ga(trackerName + '.send', 'event', 'RRBlock', '58f88ddc65bf192e5412be15', '{{data-retailrocket-markup-block}}', {
      'nonInteraction': 1
    });
  }
);
