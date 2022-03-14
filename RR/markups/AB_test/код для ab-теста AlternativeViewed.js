function getViewed() {
  var viewEvents = rrLibrary.getLocalEvents().filter(function(ev) {
    return ev.ev == 'view';
  });
  var groupViwed = rrLibrary.getLocalEvents().filter(function(ev) {
    return ev.ev == 'groupView';
  });
  var result = {};

  function incViwed(id) {
    if (!(id in result)) {
      result[id] = 0;
    }

    result[id] += 1;
  }

  viewEvents.forEach(function (event) {
    incViwed(event.dt.id);
  });

  groupViwed.forEach(function (event) {
    event.dt.ids.forEach(function (id) {
      incViwed(id);
    });
  });

  return result;
}

function upViewed(recoms) {
  var viewed = getViewed();

  recoms.forEach(function (recom) {
    if (recom.ItemId in viewed) {
      recom.Weight = recom.Weight * (Math.exp(2 * viewed[recom.ItemId]));
    }
  });

  return recoms.sort(function (a, b) {
    return b.Weight - a.Weight;
  });
}

function preRenderFn(widget, recoms, renderFn) {
  var modRecoms = upViewed(recoms);

  if (modRecoms.length > 0) {
    renderFn(modRecoms);
  }
}
