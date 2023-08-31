function rrSetSessionCookie(name, value, hoursOfLife) {
  var date = new Date(new Date().getTime() + 60 * 1000 * 60 * hoursOfLife);
  document.cookie = name + '=' + value + '; path=/; expires=' + date.toUTCString();
}

rrSetSessionCookie('rrSessionOn', 'true', 8);