//Если нужно отфильтровать элементы по совпадению

var neededCategories = [3944, 2545, 2233];
var filteredRecoms = recoms.filter(function(recom) {
  return recom.CategoryPathsToRoot.some(function(path) {
    return path.some(function (item) {
      return neededCategories.indexOf(item) > -1;
    });
  });
});

//Если нужно скрыть ненужные категории

var excludedCategories = [3944, 2545, 2233];
var filteredRecoms = recoms.filter(function (recom) {
  return recom.CategoryPathsToRoot.every(function (path) {
    return path.every(function (item) {
      return excludedCategories.indexOf(item) == -1;
    });
  });
});



