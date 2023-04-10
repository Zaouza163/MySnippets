//В свайпере устанавливаем видимость слайдов
function setVisabilityProducts() {
  var viewedProducts = $widget.querySelectorAll('.swiper-slide-visible');
  var viewedProductsIds = [];
  var fullDate = getFullDate();

  viewedProducts.forEach(function(product) {
    viewedProductsIds.push({id: Number(product.getAttribute('data-item-id')), time: fullDate});
    product.classList.add('rr-widget__viewed-product');
  });

  if (sessionStorage.viewedSliderProducts === undefined) {
    sessionStorage.setItem('viewedSliderProducts', JSON.stringify(viewedProductsIds))
  } else {
    var oldProducts = JSON.parse(sessionStorage.getItem('viewedSliderProducts')).slice(0, 50);
    var viewedIds = viewedProductsIds.map(function(item) { return item.id })
    var filteredDoubleProducts = oldProducts.filter(function(item) {
      return viewedIds.indexOf(item.id) === -1
    })

    sessionStorage.setItem('viewedSliderProducts', JSON.stringify(viewedProductsIds.concat(filteredDoubleProducts)));
  }
}

function checkPosition() {
  widgetPosition = Math.round($widget.getBoundingClientRect().top + $widget.offsetHeight / 2);
  if (0 < widgetPosition && widgetPosition < screenHeight) {
    setVisabilityProducts();
    window.removeEventListener('scroll', checkPosition);
  }
}

var sendedItemsIndexes = [];
var screenHeight = window.innerHeight;
var widgetPosition = Math.round($widget.getBoundingClientRect().top + $widget.offsetHeight / 2);

if (0 < widgetPosition && widgetPosition < screenHeight) {
  setVisabilityProducts();
} else {
  window.addEventListener('scroll', checkPosition);
}

})
.on('slideChange', function() {
var viewedProducts = $widget.querySelectorAll('.swiper-slide-visible:not(.rr-widget__viewed-product)');
var viewedProducIds = setViewedProducts(viewedProducts);

sessionStorage.setItem('viewedSliderProducts', viewedProducIds);
})

//Создаем массив в storage
function setViewedProducts(slides) {
  var fullDate = getFullDate();
  var viewedProductsIds = [];

  slides.forEach(function (product) {
    viewedProductsIds.push({
      id: Number(product.getAttribute('data-item-id')),
      time: fullDate
    });
    product.classList.add('rr-widget__viewed-product');
  });

  var oldProducts = JSON.parse(sessionStorage.getItem('viewedSliderProducts')).slice(0, 50);
  var viewedIds = viewedProductsIds.map(function (item) {
    return item.id
  })

  var filteredIds = oldProducts.filter(function (item) {
    return viewedIds.indexOf(item.id) === -1
  })

  return JSON.stringify(viewedProductsIds.concat(filteredIds))
}

function getFullDate() {
  var date = new Date();
  return +((date.getFullYear() + '.' + addZeros(date.getMonth() + 1) + '.' + addZeros(date.getDate()) + '.' + addZeros(date.getHours()) + '.' + addZeros(date.getMinutes()) + '.' + addZeros(date.getSeconds())).split('.').join(''))
}

function sortViewedProducts(viewedProducts) {
  return viewedProducts.sort(function(a, b) {
    return a.persIndex - b.persIndex
  })
}

function downViewed(recoms) {
  var sessionViewed = JSON.parse(sessionStorage.getItem('viewedSliderProducts')) || [];
  var viewedProducts = [];
  var newProducts = [];

  recoms.forEach(function (recom) {
    sessionViewed.forEach(function(item) {
      if (recom.ItemId == item.id) {
        recom.persIndex = item.time
      }
    });

    if (recom.persIndex) {
      viewedProducts.push(recom)
    } else {
      newProducts.push(recom)
    }
  });

  return newProducts.concat(sortViewedProducts(viewedProducts))
}

function addZeros(n, needLength) {
  needLength = needLength || 2;
  n = String(n);
  while (n.length < needLength) {
    n = "0" + n;
  }
  return n
}

//Отправляем трек
function setStatisticsRender(originalRecomItem, modifiedRecomItem, algorithmName, categoryId) {
  var originalRecomItemIds = originalRecomItem.map(function(product) { return product.ItemId });
  var modifiedRecomItemIds = modifiedRecomItem.map(function(product) { return product.ItemId });

  recomTrackSetting.listTrack().forEach(function(track) {
    rrApiOnReady.push(function() {
      rrApi.recomTrack(
        '{{data-retailrocket-markup-block}}',
        0,
        [],
        {
          categoryId: categoryId,
          originalRecomItemIds: originalRecomItemIds,
          modifiedRecomItemIds: modifiedRecomItemIds,
          recomItemIds: originalRecomItemIds,
          eventType: 'blockPersonalSort',
          abtest: recomTrackSetting.abSegment,
          algorithm: algorithmName
        }
      );
    });
  });
}

function preRenderFn(widget, recoms, renderFn) {
  var priorityRecoms = downViewed(recoms);

  setStatisticsRender(recoms, priorityRecoms, widget.dataset.algorithm, '{{data-category-id}}');
  renderFn(priorityRecoms);
}