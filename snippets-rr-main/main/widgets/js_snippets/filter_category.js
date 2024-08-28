var filteredRecoms = array.filter(function (recom) {
  return recom.CategoryIds.every(function (id) {
    // в выдаче остаются элементы категории которых нет в category, проверяются все элементы
    return category.indexOf(id) == -1; // category: number[]
  });
});

var filteredRecoms = array.filter(function (recom) {
  return recom.CategoryIds.some(function (id) {
    // остаются элементы категориии которых присутствуют в category
    return category.indexOf(id) !== -1; // category: number[]
  });
});

