var now = new Date();
var start = new Date(2021, 5 - 1, 7); //(year, month - 1, day, hour, minute, second)
var finish = new Date(2021, 5 - 1, 21); //(year, month - 1, day, hour, minute, second)

//now - start > 0 текущая дата вошла в диапазон
//now - finish < 0 текущая дата еще не вышла из диапазона
if (now - start > 0 && now - finish < 0) {
  //logic
}