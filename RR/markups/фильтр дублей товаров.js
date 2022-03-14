if (!('duplicates' in retailrocket.modules)) {
  retailrocket.setModule('duplicates', [], function () {
    var savedIds = [];
    var paramName = 'ItemId';

    function has(id) {
      return savedIds.indexOf(id) !== -1;
    }

    function add(id) {
      savedIds = savedIds.concat(id);
    }

    function remove(id) {
      var ids = [].concat(id);

      savedIds = savedIds.filter(function (savedId) {
        return ids.indexOf(savedId) === -1;
      });
    }

    function filter(recom) {
      if (!recom[paramName]) {
        return true;
      }

      if (!has(recom[paramName])) {
        add(recom[paramName]);
        return true;
      }

      return false;
    }

    function filteredCount(recoms) {
      return recoms.reduce(function (acc, recom) {
        return acc + (has(recom[paramName]) ? 1 : 0);
      }, 0);
    }

    function getItems() {
      return savedIds.slice();
    }

    return {
      has: has,
      add: add,
      remove: remove,
      filter: filter,
      filteredCount: filteredCount,
      getItems: getItems,
    };
  });
}

function preRenderFn(widget, recoms, renderFn) {
  var filteredRecoms = recoms.filter(retailrocket.modules.duplicates.filter);

  if (filteredRecoms.length > 0) {
    renderFn(filteredRecoms);
  }
}
