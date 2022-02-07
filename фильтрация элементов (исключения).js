var hideCategory = [3944];
var sortingRecoms = recoms.filter(function(recom) {
  return recom.CategoryIds.some(function(item) {
    return hideCategory.indexOf(item) === -1;
  })
})
if (sortingRecoms.length > 4) {
  renderFn(sortingRecoms);
}