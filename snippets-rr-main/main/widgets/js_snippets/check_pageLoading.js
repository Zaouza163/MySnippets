var readyCheck = setInterval(function() {
  if (document.readyState === 'complete') {
    someFunction();
    clearInterval(readyCheck)
  }
}, 1000);