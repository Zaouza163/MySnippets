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