var isNumber = function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

var isNumberObject = function isNumberObject(n) {
  return (Object.prototype.toString.apply(n) === '[object Number]');
}

var isCustomNumber = function isCustomNumber(n){
  return isNumber(n) || isNumberObject(n);
}