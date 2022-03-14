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

function rrGetCookie(name) {
  var matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ));

  return matches ? decodeURIComponent(matches[1]) : false;
}

function rrSetCookie(name, value, daysOfLife) {
  var date = new Date(new Date().getTime() + 60 * 1000 * 60 * 24 * daysOfLife);
  document.cookie = name + '=' + value + '; path=/; expires=' + date.toUTCString();
}

waitFor(
  function() {
    return ('ga' in window && 'getAll' in window.ga);
  },
  function() {
    if (!rrGetCookie('showMarkupTestCard')) {
      var trackerName = ga.getAll()[0].get('name');

      ga(trackerName + '.send', 'event', 'RRBlock', '58f88ddc65bf192e5412be15', '{{data-retailrocket-markup-block}}', {
        'nonInteraction': 1
      });

      rrSetCookie('showMarkupTestCard', '1', 60);
    }
  }
);
