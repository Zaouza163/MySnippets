function sortSizes(rec) {
  rec.forEach(function (item) {
    if (item.Params['Размеры'] && item.Params['Размеры'] !== '') {
      var sizes = item.Params['Размеры'].split(',').map(function (item) { return String(item) });
      var newSizes = sizes.sort(function (a, b) {
        var order = ['XXS', 'XS', 'S', 'S-M', 'M', 'L', 'L-XL', 'XL', 'XXL', 'XXXL', 'XXXXL'];

        return order.indexOf(a) - order.indexOf(b);
      });

      item.Params['Размеры'] = newSizes.join(',');
    }
  });
}