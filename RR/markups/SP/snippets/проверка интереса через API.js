retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
  function getItemsPopular(callback) {
    retailrocket.recommendation.forCategories(
      retailrocket.api.getPartnerId(),
      [0],
      'popular',
      {},
      callback
    );
  }

  function getItemsVCI(callback) {
    retailrocket.recommendation.forVisitorCategoryInterest(
      retailrocket.api.getPartnerId(),
      retailrocket.api.getSessionId(),
      'popular',
      {},
      callback
    );
  }

  function filterDuplicates(arrayToCheck, arrayBase, paramName) {
    return arrayToCheck.filter(function (itemToCheck) {
      return !arrayBase.some(function (arrayBase) {
        return itemToCheck[paramName] == arrayBase[paramName];
      });
    });
  }

  function checkInterest(itemsPopular, itemsVCI) {
    var SPbase = {};
    var VCIrecoms = filterDuplicates(itemsVCI, itemsPopular, 'ItemId');

    if (VCIrecoms.length > 0) {
      SPbase.hasVI = true;
      SPbase.recoms = VCIrecoms.slice(0);
    } else {
      SPbase.hasVI = false;
      SPbase.recoms = itemsPopular.slice(0);
    }

    return SPbase;
  }

  function preRenderFn(widget, recoms, renderFn) {
    getItemsPopular(function (itemsPopular) {
      getItemsVCI(function (itemsVCI) {
      var newRecoms = checkInterest(itemsPopular, itemsVCI);

        if (newRecoms.hasVI) {
          // SP logic
        } else {
          // default logic
        }
      });
    });
  }

  return {
    preRenderFn: preRenderFn,
  };
})();
