function sortAlternation(recoms) {
  var recomsMod = recoms.sort(function (a,b) {
        return a.length - b.length;
      }),
      fullRecoms = [];
  
  recomsMod[recomsMod.length - 1].forEach(function (item, iProduct) {
    recomsMod.forEach(function (recomsVendor, iVendorRecoms) {
      if (iProduct + 1 <= recomsVendor.length) {
        fullRecoms.push(recomsVendor[iProduct]);
      }
    });
  });
  
  return fullRecoms;
}

var exampleArray = [
  ['val11', 'val12', 'val13', 'val14', 'val15'],
  ['val21', 'val22', 'val23', 'val24', 'val25'],
  ['val31', 'val32', 'val33'],
];

sortAlternation(exampleArray);

// output ["val11", "val21", "val31", "val12", "val22", "val32", "val13", "val23", "val33", "val14", "val24", "val15", "val25"]
