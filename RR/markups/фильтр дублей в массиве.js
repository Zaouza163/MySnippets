function filterDouble(array) {
  var ids = array.map(function (item) {
    return item.ItemId;
  });

  return array.filter(function (item, index) {
    return ids.indexOf(item.ItemId) === index;
  });
}

//example
filterDouble(array);