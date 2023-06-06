var hoursLeft = rrMarkup.querySelector('.rr-container-top-timer__hours--left span'),
    hoursRight = rrMarkup.querySelector('.rr-container-top-timer__hours--right span'),
    minuteLeft = rrMarkup.querySelector('.rr-container-top-timer__minute--left span'),
    minuteRight = rrMarkup.querySelector('.rr-container-top-timer__minute--right span'),
    secondLeft = rrMarkup.querySelector('.rr-container-top-timer__second--left span'),
    secondRight = rrMarkup.querySelector('.rr-container-top-timer__second--right span');

var timer = function () {
  var diff = end.getTime() - Date.now();

  if (diff <= 0) return clearInterval(i);

  diff /= 1e3;

  var timeArr = [
    diff / 3600 % 24 |0,
    diff / 60 % 60   |0,
    diff / 1 % 60    |0,
  ].map(function (d) {
    return d < 10 ? '0' + d : String(d)
  });

  hoursLeft.innerText = timeArr[0].split('')[0];
  hoursRight.innerText = timeArr[0].split('')[1];
  minuteLeft.innerText = timeArr[1].split('')[0];
  minuteRight.innerText = timeArr[1].split('')[1];
  secondLeft.innerText = timeArr[2].split('')[0];
  secondRight.innerText = timeArr[2].split('')[1];
};

var i = setInterval(timer, 450);
timer();