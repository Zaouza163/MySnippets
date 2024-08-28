// new Date(year, month - 1, day, hour, minute, second)
// now - start > 0 текущая дата вошла в диапазон
// now - finish < 0 текущая дата еще не вышла из диапазона

var now = new Date();
var start = new Date(2024, 11 - 1, 25);
var finish = new Date(2024, 11 - 1, 29);

if (now - start > 0 && now - finish < 0) {
  //logic
}
