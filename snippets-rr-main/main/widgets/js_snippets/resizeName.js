function maxRR (array) {
  var max = parseInt(array[array.length-1]), 
      el;
  
  for (var i = array.length - 2; i >= 0; i--) {
    
    el = parseInt(array[i]);
    
    if(el > max) {
      max = el;
    }
  }
  
  return max;
};

function resizeName (widget) {
  var allNameBlock = widget.querySelectorAll('.rr-item-center');
  var allNameTag = widget.querySelectorAll('.rr-item-center a');
  var heightTagArr = [];

  allNameTag.forEach(function (tag) {
    heightTagArr.push(tag.offsetHeight);
  });

  var maxHeight = maxRR(heightTagArr);

  allNameBlock.forEach(function (name) {
    name.style.height = maxHeight + 'px';
  });
}

on : { // in swiper module
  init: function () {
    resizeName(widget);
    
    window.addEventListener('resize', function () {
      resizeName(widget);
    });
  }
},
