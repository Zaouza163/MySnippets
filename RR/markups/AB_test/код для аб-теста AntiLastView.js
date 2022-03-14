function transformByViewed(recoms, position, reverse) {
  var excludePurchased = function (products) {
    var cartProducts = retailrocket.localEvents.getBasketProductIds();
    var orderedProducts = retailrocket.localEvents.getOrderedProductIds();
    var result = products.filter(function (product) {
      var id = String(product.ItemId);

      return (cartProducts.indexOf(id) === -1 && orderedProducts.indexOf(id) === -1);
    });

    return result;
  };

  var isolateViewed = function (products) {
    var getViewedIds = function () {
      var viewEvents = rrLibrary.findLocalEvents(['view', 'groupView']);
      var groupIds = viewEvents.map(function (ev) {
        return ev.dt.ids || ev.dt.id || [];
      });
      var ids = [].concat.apply([], groupIds).map(Number);

      return ids;
    };

    var viewedIds = getViewedIds();

    var notViewedItems = [];
    var viewedItems = products.filter(function (product) {
      if (viewedIds.indexOf(product.ItemId) === -1) {
        notViewedItems.push(product);
        return false;
      }

      return true;
    });

    return [viewedItems, notViewedItems];
  };

  var splittedProducts = isolateViewed(excludePurchased(recoms));

  if (reverse) {
    splittedProducts[0].reverse();
  }

  if (position === 'down') {
    splittedProducts.reverse();
  }

  return [].concat.apply([], splittedProducts);
}

function preRenderFn(widget, recoms, renderFn) {
  var transformedRecoms = transformByViewed(recoms, 'down');

  if (transformedRecoms.length > 0) {
    renderFn(transformedRecoms);
  }
}
