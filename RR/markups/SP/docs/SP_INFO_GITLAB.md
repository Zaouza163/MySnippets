# Документация по работе с задачами SP

1. [Шаблон виджета с GA + Recomtracks](#templateGaRecomtrack)
   1. [Виды Recomtracks](#recomtracksTypes)
      - [setSpecificStatisticsRender](#setRender)
      - [setStatisticsShow](#setShow)
      - [setStatisticsClick](#setClick)
   2. [Google analytics](#ga)
      1. [Общий вид события](#gaGeneral)
      2. [waitFor](#waitFor)
   3. [Пример шаблона](#exampleTemplate)
3. [Тестовая среда](#testEnv)
   1. [Настройка окружения](#setEnv)
   2. [Работа с файлами](#testFiles)
4. [Кейсы](#cases)
   1. [Общие сведения](#casesInfo)
   2. [Главная страница](#homePage)
      - [Шаблон для главной страницы](#homePageTemplate)
   3. [Категория](#categoryPage)
      - [Шаблон для категории](#categoryPageTemplate)
   4. [Карточка товара](#cardPage)
      - [Шаблон для карточки товара](#cardPageTemplate)
   5. [Поиск](#searchPage)
      - [Шаблон для поиска](#searchPageTemplate)
   6. [Пустой поиск](#emptySearch)
      - [Шаблон для пустого поиска](#emptySearchPageTemplate)
5. [Вывод блоков SP в бой](#finalStage)
   1. [Общие сведения](#finalStageInfo)
   2. [Рендер SP блока с одним брендом](#renderOneBlock)
   3. [Рендер SP блоков по приоритетам](#renderWithPriorities)
   4. [Рендер SP блоков с использованием сегментатора](#renderWithSegmentator)
      - [Шаблоны](#renderTemplatesCookie)
        - [Главная страница](#renderHomeSegmentator)
        - [Категория](#renderCategorySegmentator)
        - [Карточка товара](#renderCardSegmentator)
        - [Поиск](#renderSearchSegmentator)
        - [Пустой поиск](#renderEmptySearchSegmentator)


# <a name="templateGaRecomtrack"></a> Шаблон виджета с GA + Recomtracks

# <a name="recomtracksTypes"></a> Виды Recomtracks

```js
/**
 * algorithm {String} - переменная, которая содержит название алгоритма, который ренедрится на странице
 * SegmentID {String} - id сегмента для которого проводится АБ тестирование
 * setStatisticsRender {Function} - отправка события показа (отправлен markuprendered) блока с одним из алгоритмов
 * setStatisticsShow {Function} - отправа события просмотра (отправлен markuviewed) блока с одним из алгоритмов
 * setStatisticsClick {Function} - отправка события клика по товару в блоке (там же, где и onMouseDown)
 * needRecomTrack {Boolean} - флаг для отправки рекомтреков (поменять на true если выполняется условие SP)
 */

function getProductsId(products) {
  return products.map(function (product) {
    return product.ItemId;
  });
}

function setStatisticsRender(items) {
  if (needRecomTrack) {
    var recomIds = getProductsId(items);

    rrApiOnReady.push(function () {
      rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
        0, 
        [recomIds], {
        eventType: 'blockRender',
        abtest: '',
        algorithm: algorithm,
      });
    });
  }
}

function setStatisticsShow(items) {
  if (needRecomTrack) {
    var recomIds = getProductsId(items);

    rrApiOnReady.push(function () {
      rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
        0, 
        [recomIds], {
        eventType: 'blockView',
        abtest: '',
        algorithm: algorithm,
      });
    });
  }
}

function setStatisticsClick(itemId) {
  if (needRecomTrack) {
    rrApiOnReady.push(function () {
      rrApi.recomTrack('{{data-retailrocket-markup-block}}', 0, [], {
        eventType: 'blockClick',
        clickedItem: itemId,
        abtest: '',
        algorithm: algorithm,
      });
    });
  }
}
```

# <a name="setRender"></a> setSpecificStatisticsRender

С помощью функции setSpecificStatisticsRender мы отправляем данные об ID рекомендаций, которые будут выведены на страницу

Пример использования:

```js
function preRenderFn(widget, recoms, renderFn) {
  setStatisticsRender(recoms);
  renderFn(recoms);
}
```

# <a name="setShow"></a> setStatisticsShow

С помощью функции setStatisticsShow мы отправляем данные об ID рекомендаций, когда пользователь увидел блок с товарами

Пример использования:

```js
function postRenderFn(widget) {
  var products = widget.querySelectorAll('.rr-item');
  var isShow = false;
  var recoms = [];

  var rrSwiperCarousel = new SwiperModel({
    widget: widget,
    settingSwiper: {
      wrapperClass: 'rr-swiper-wrapper',
      slideClass: 'rr-swiper-slide',
      init: false,
      updateOnWindowResize: true,
      watchOverflow: true,
      observer: true,
      spaceBetween: 0,
      lazy: true,
      preloadImages: true,
      touchReleaseOnEdges: true,
      watchSlidesVisibility: true,
      loop: true,
      navigation: {
        prevEl: widget.querySelector('.swiper-prev'),
        nextEl: widget.querySelector('.swiper-next'),
      },
      pagination: {
        el: widget.querySelector('.rr-slider-dots'),
        type: 'bullets',
        clickable: true,
      },
      autoplay: false,
      speed: 800,
      breakpoints: {
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        500: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        320: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
      },
    },
  });
  rrSwiperCarousel.getScript();

  products.forEach(function (item) {
    var product = {
      ItemId: item.getAttribute('data-id'),
    };

    recoms.push(product);
  });

  window.addEventListener('scroll', function () {
    if (!isShow) {
      var widgetScrollTop = widget.getBoundingClientRect()['top'];

      if (widgetScrollTop < 150) {
        setStatisticsShow(recoms);
        isShow = true;
      }
    }
  });
}
```

# <a name="setClick"></a> setStatisticsClick

С помощью функции setStatisticsClick мы отправляем данные о товаре, на которые пользователь кликнул

Пример использования:

```html
<a class="rr-item__info" href="<%=Url%>" onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
  <img class="swiper-lazy" data-src="https://cdn.retailrocket.net/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=jpg&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both"/>
  <div class="swiper-lazy-preloader"></div>
</a>
```

<span style="color:red">Внимание!</span>

У некоторых клиентов в разметке может быть множество событий, которые отслеживают клик по элементу или товару.
В таком случае важно следить, чтобы не было всплытия событий и лучше вешать одно событие на общий контейнер товара.

Например:

```html
<div class="rr-widget__item" onmousedown="retailrocket.store{{data-retailrocket-markup-block}}.digitalDataClick(<%=i%>);retailrocket.store{{data-retailrocket-markup-block}}.setStatisticsClick(<%=ItemId%>);" data-id="<%=ItemId%>" data-name="<%=Name%>" data-price="<%=Price%>" data-old-price="<%=OldPrice%>" data-vendor="<%=Vendor%>">
  <!-- разметка элементов -->
</div>
```

# <a name="ga"></a> Google analytics

Событие Google analytics должно отправляться всегда, вне зависимости от рендеринга блока

# <a name="gaGeneral"></a> Общий вид события:

```js
waitFor(
  function () {
    return 'ga' in window && 'getAll' in window.ga;
  },
  function () {
    var trackerName = ga.getAll()[0].get('name');

    ga(
      trackerName + '.send',
      'event',
      'RRBlock',
      '', // <SegmentId>
      '{{data-retailrocket-markup-block}}',
      {
        nonInteraction: 1,
      }
    );
  }
);
```

# <a name="waitFor"></a> waitFor

<span style="color:red">Не забываем добавлять функцию waitFor в код</span>

```js
var waitFor = function (exitCondition, callback, force) {
  var checkCount = 100;
  var timeout = 1000;

  (function check() {
    var result = exitCondition();
    if (result) {
      callback(result);
      return;
    }

    if (checkCount === 0) {
      if (force) {
        callback();
      }
      return;
    }

    checkCount -= 1;
    setTimeout(check, timeout);
  })();
};
```

# <a name="exampleTemplate"></a> Пример шаблона

```html
<style type="text/css">
.rr-widget[data-s="{{data-retailrocket-markup-block}}"]{height:0;visibility:hidden;overflow:hidden;position:relative;display:block;width:100%;font-family:inherit;box-sizing:border-box}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"].rr-active{height:auto;visibility:visible;overflow:visible;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] *{outline:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-widget__title{font-size:18px;font-weight:700;color:#023f5d;text-align:left;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-items{position:relative;overflow:hidden;padding:0;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image{width:100%;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image img{width:auto;height:auto;max-width:100%;max-height:100%;vertical-align:middle;margin:0 auto;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-wrapper{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-box-sizing:content-box;box-sizing:content-box;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-slide{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;height:auto;position:relative;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item{padding:0 5px;text-align:center;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader{background:#fff;width:100%;height:100%;position:absolute;top:0;left:0;z-index:9;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader:after{display:block;content:'';background-image:url('https://rrstatic.retailrocket.net/widget/img/swiper_preloader.svg');background-position:50%;background-size:100%;background-repeat:no-repeat;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-ms-transform-origin:50%;transform-origin:50%;background-repeat:no-repeat;-webkit-animation:swiper-preloader-spin 1s steps(50, end) infinite;animation:swiper-preloader-spin 1s steps(50, end) infinite;}
@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__info{text-decoration:none;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title{display:inline-block;font-size:16px;font-weight:400;line-height:20px;color:#043e5e;height:40px;overflow:hidden;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title:hover{text-decoration:none;color:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__old-price{font-size:16px;font-weight:400;color:#023f5d;text-decoration:line-through;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price{font-size:16px;font-weight:400;color:#19addd;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price-currency::before{content:'₽ €'}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more{display:block;width:50%;padding:0 15px;background:#023f5d;color:#fff;font-size:14px;font-weight:400;line-height:35px;-webkit-border-radius:5px 0 0 5px;-moz-border-radius:5px 0 0 5px;border-radius:5px 0 0 5px;text-align:center;text-decoration:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more:hover{text-decoration:none;background:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy{font-size:14px;font-weight:400;line-height:35px;color:#fff;background-color:#19addd;padding:0 15px;text-align: center;display:block;text-decoration: none;-webkit-border-radius:0 5px 5px 0;-moz-border-radius:0 5px 5px 0;border-radius:0 5px 5px 0;width:50%;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy:hover{background-color:#2bc4f7}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-arrow{position:absolute;top:50%;-webkit-transform:translate(0, -50%);-moz-transform:translate(0, -50%);-ms-transform:translate(0, -50%);-o-transform:translate(0, -50%);transform:translate(0, -50%);background:url('https://rrstatic.retailrocket.net/widget/img/slider_arrow.svg') no-repeat center center;background-size:contain;width:30px;height:30px;display:block;-webkit-transition:all ease .3s;-moz-transition:all ease .3s;-ms-transition:all ease .3s;-o-transition:all ease .3s;transition:all ease .3s;cursor:pointer;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev{left:0;-webkit-transform:translate(0, -50%) rotate(180deg);-moz-transform:translate(0, -50%) rotate(180deg);-ms-transform:translate(0, -50%) rotate(180deg);-o-transform:translate(0, -50%) rotate(180deg);transform:translate(0, -50%) rotate(180deg);}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev:hover,
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next:hover{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next{right:0;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-arrow .swiper-button-disabled{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-button-lock{display:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-dots{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;justify-content:center;-webkit-justify-content:center;margin-top:10px;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet{border:solid 1px #19addd;width:12px;height:12px;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;margin:0 2px;cursor:pointer;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet.swiper-pagination-bullet-active{border-color:#023f5d;background:#023f5d;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullets.swiper-pagination-lock{display:none;}
</style>

<div 
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}" 
  data-algorithm="popular" 
  data-algorithm-argument="0"
  data-template-param-header-text="retailrocket" 
  data-template-param-number-of-items="8"
  data-template-param-item-image-width="320" 
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}">
</div>

<script id="widget-template-{{data-retailrocket-markup-block}}" type="text/html">
  <div class="rr-widget__title">
    <%=(headerText)%>
  </div>
  <div class="rr-items rr-swiper-container">
    <div class="rr-swiper-wrapper">
      <% for (var i = 0 ; i < numberOfItems; ++i) with(items[i]) { %>
      <div class="rr-swiper-slide">
        <div class="rr-item" data-id="<%=ItemId%>">
          <div class="rr-item__image">
            <a class="rr-item__info" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <img class="swiper-lazy"
                data-src="https://cdn.retailrocket.net/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=jpg&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both">
              <div class="swiper-lazy-preloader"></div>
            </a>
          </div>
          <div class="rr-item__name-block">
            <a class="rr-item__info rr-item__title" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <% if (Name.length > 26) { %>
              <%=Name.substr(0,26)+('...') %>
              <% } else { %>
              <%=Name %>
              <% } %>
            </a>
          </div>
          <div class="rr-item__block-price">
            <% if (OldPrice > Price) { %>
            <div class="rr-item__old-price"> <span
                class="rr-item__old-price-value"><%= retailrocket.widget.formatNumber(OldPrice, '.', ' ', 0) %></span>
              <span class="rr-item__price-currency"></span> </div>
            <% } %>
            <div class="rr-item__price"> <span
                class="rr-item__price-value"><%= retailrocket.widget.formatNumber(Price, '.', ' ', 0) %></span> <span
                class="rr-item__price-currency"></span> </div>
          </div>
          <div class="rr-item__actions">
            <a class="rr-item__actions-more" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>Подробнее</a>
            <a class="rr-item__actions-buy" href="<%=Url%>"
              onclick='rrApi.recomAddToCart(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });'>Купить</a>
          </div>
        </div>
      </div>
      <% } %>
    </div>
  </div>

  <div class="rr-slider-arrow">
    <a class="rr-arrow swiper-prev"></a>
    <div class="rr-slider-dots"></div>
    <a class="rr-arrow swiper-next"></a>
  </div>
</script>

<script type="text/javascript">
  /**
   * algorithm {String} - переменная, которая содержит название алгоритма, который ренедрится на странице
   * defaultAlgo {String} - переменная, которая содержит базовый алгоритм маркап-блока
   * SegmentID {String} - id сегмента для которого проводится АБ тестирование
   * setStatisticsRender {Function} - отправка события показа (отправлен markuprendered) блока с одним из алгоритмов
   * setStatisticsShow {Function} - отправа события просмотра (отправлен markuviewed) блока с одним из алгоритмов
   * setStatisticsClick {Function} - отправка события клика по товару в блоке (там же, где и onMouseDown)
   * ga {Function} - функия отправки события в Google Analitics независимо от рендера блока
   */

  (function (retailrocket) {
    'use strict';

    var waitFor = function (exitCondition, callback, force) {
      var checkCount = 100;
      var timeout = 1000;

      (function check() {
        var result = exitCondition();
        if (result) {
          callback(result);
          return;
        }

        if (checkCount === 0) {
          if (force) {
            callback();
          }
          return;
        }

        checkCount -= 1;
        setTimeout(check, timeout);
      })();
    };

    var SwiperModel = function (setting) {
      var $widget = setting.widget;
      var swiperSeector = '.rr-swiper-container';
      var source = 'https://rrstatic.retailrocket.net/widget/plugins/rrswiper/rrswiper.min.js';
      var itemsCount = $widget.getAttribute('data-number-of-rendered-items');

      function checkloop(paramsSlider) {
        var modSetting = paramsSlider;

        if (modSetting.loop == true) {
          for (var point in modSetting.breakpoints) {
            if (itemsCount <= modSetting.breakpoints[point].slidesPerView) {
              modSetting.breakpoints[point].loop = false;
            } else {
              modSetting.breakpoints[point].loop = true;
            }
          }
        }

        return modSetting;
      }

      function render(swiperLibrary) {
        var SwiperParams = checkloop(setting.settingSwiper);
        var $rrContainer = $widget.querySelector(swiperSeector);
        var rrSwiper = swiperLibrary == 'RRSwiper' ? new RRSwiper($rrContainer, SwiperParams) : new Swiper($rrContainer, SwiperParams);

        rrSwiper
          .on('init', function () {
            var $imgError = $widget.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate) img');
            var counter = 0;
            var indexImg = [];

            $imgError.forEach(function (img) {
              img.onerror = function () {
                var $slideItem = img.closest('.rr-swiper-slide');
                var $slideSiblings = $slideItem.parentNode.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate)');
                indexImg.push($slideItem.getAttribute('data-swiper-slide-index'));

                if ($imgError.length == counter) {
                  rrSwiper.removeSlide(indexImg);
                }
              };
              counter++;
            });
            $widget.classList.add('rr-active');
          })
          .on('observerUpdate', function () {
            rrSwiper.resize.resizeHandler();
          });
        rrSwiper.init();
      }

      function getScript() {
        var swiperJs = document.createElement('script');
        var getElemScript = document.getElementsByTagName('script')[0];
        swiperJs.async = 1;

        if (!window.Swiper && !window.RRSwiper) {
          swiperJs.onload = swiperJs.onreadystatechange = function (_,isAbort) {
            if (isAbort || !swiperJs.readyState || /loaded|complete/.test(swiperJs.readyState)) {
              swiperJs.onload = swiperJs.onreadystatechange = null;
              swiperJs = undefined;

              if (!isAbort) setTimeout(render('RRSwiper'), 0);
            }
          };

          swiperJs.src = source;
          getElemScript.parentNode.insertBefore(swiperJs, getElemScript);
        } else {
          var versionSwiper = window.hasOwnProperty('RRSwiper') ? 'RRSwiper' : 'Swiper';
          render(versionSwiper);
        }
      }

      this.getScript = getScript;
    };

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var algorithm = '',
        needRecomTrack = false;

      function getProductsId(products) {
        return products.map(function (product) {
          return product.ItemId;
        });
      }

      function setStatisticsRender(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockRender',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsShow(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockView',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsClick(itemId) {
        if (needRecomTrack) {
          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 0, [], {
              eventType: 'blockClick',
              clickedItem: itemId,
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function preRenderFn(widget, recoms, renderFn) {
        var defaultAlgo = widget.getAttribute('data-algorithm');

        if (recoms.length > 0) {
          // SP logic
          algorithm = 'SP';
          needRecomTrack = true;
          setStatisticsRender(recoms);
          renderFn(recoms);
        } else {
          // default logic
          algorithm = defaultAlgo;
          setStatisticsRender(recoms);
          renderFn(recoms);
        }
      }

      function postRenderFn(widget) {
        var products = widget.querySelectorAll('.rr-item');
        var isShow = false;
        var recoms = [];

        var rrSwiperCarousel = new SwiperModel({
          widget: widget,
          settingSwiper: {
            wrapperClass: 'rr-swiper-wrapper',
            slideClass: 'rr-swiper-slide',
            init: false,
            updateOnWindowResize: true,
            watchOverflow: true,
            observer: true,
            spaceBetween: 0,
            lazy: true,
            preloadImages: true,
            touchReleaseOnEdges: true,
            watchSlidesVisibility: true,
            loop: true,
            navigation: {
              prevEl: widget.querySelector('.swiper-prev'),
              nextEl: widget.querySelector('.swiper-next'),
            },
            pagination: {
              el: widget.querySelector('.rr-slider-dots'),
              type: 'bullets',
              clickable: true,
            },
            autoplay: false,
            speed: 800,
            breakpoints: {
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              500: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
              },
            },
          },
        });
        rrSwiperCarousel.getScript();

        products.forEach(function (item) {
          var product = {
            ItemId: item.getAttribute('data-id'),
          };

          recoms.push(product);
        });

        window.addEventListener('scroll', function () {
          if (!isShow) {
            var widgetScrollTop = widget.getBoundingClientRect()['top'];

            if (widgetScrollTop < 150) {
              setStatisticsShow(recoms);
              isShow = true;
            }
          }
        });
      }

      return {
        postRenderFn: postRenderFn,
        preRenderFn: preRenderFn,
        setStatisticsClick: setStatisticsClick,
      };
    })();

    waitFor(
      function () {
        return 'ga' in window && 'getAll' in window.ga;
      },
      function () {
        var trackerName = ga.getAll()[0].get('name');

        ga(
          trackerName + '.send',
          'event',
          'RRBlock',
          '', // <SegmentId>
          '{{data-retailrocket-markup-block}}', {
            nonInteraction: 1,
          }
        );
      }
    );

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="testEnv"></a> Тестовая среда

# <a name="setEnv"></a> Настройка окружения

1. Скачать программу [WinSCP](https://winscp.net/eng/index.php)
2. Ввести данный для сервера [Пример](https://prnt.sc/uguypj)
3. В настройках можно [добавить](https://prnt.sc/ugvcz0) редактор кода для открытия файлов (Необходимо указать путь до файла запуска редактора и переместить его на первое место в списке редакторов)
4. [Тестовый сайт](http://school.gildiya.pro/)

#### Данные для нашего сервера:

| Host | p202164.ftp.ihc.ru   |
|:-----|----------------------|
| User | p202164_school       |
| Pass | 63fDGy44Rgi7Em9wUR9V |

# <a name="testFiles"></a> Работа с файлами

- В корневой папке можно увидеть список файлов для разных [клиентов](http://prntscr.com/ugvfsv)
- Для новых клиентов или брендов нужно создавать новые папки с файлами
- Внутри одного клиента также может быть создана папка для [мобильной](http://prntscr.com/ugvgsc) версии сайта
- Каждый файл это отдельная страница (главная, карточка и тд)
- Для каждого тестового блока будет создан тестовый маркап, ID и параметры которого нужно указать в [файле](http://prntscr.com/ugvhm4)
- Внутри файла нужно указать [PartnerId](http://prntscr.com/ui5cn2) клиента для передач данных
- При успешном выполнении всех действий получим [аналог боевого блока](https://prnt.sc/ugvjib) клиента для последующей работы
- [Живой пример](http://school.gildiya.pro/goods_hair/card.html)

# <a name="cases"></a> Кейсы

# <a name="casesInfo"></a> Общие сведения

<span style="color:green;font-weight:700;font-style:italic">Техническое задание может включать в себя дополнительные условия выполнения, например сортировка или фильтрация рекомендаций, данные условия являются индивидуальными для клиентов, поэтому они учитыаются в рамках конкретной задачи. В примерах ниже, за основу взята общая логика возможных страниц, которая внедряется в уже существующую логику маркапов клиента.</span>

# <a name="homePage"></a> Главная страница

### Техническое задание

Используем верхний ряд (первые 5 товаров) для механики SP

Описание логики для SP:

Запрашиваем VI. Получаем выдачу 50 товаров.
Берем первый товар, смотрим его categoryPathToRoot.

Случай 1 Если нет интересов (VI не изменён), показывается VI.
Случай 2 Если есть интерес (VI выдача изменилась), тогда:

1. Берём первый товар из выдачи VI и смотрим категорию этого товара.
2. Строим popular по бренду “Oral-B” по выбранной категории.

- Если такой популар пустой, берём следующий товар из выдачи VI и так далее до конца выдачи.
- Если товаров меньше 5, добиваем базовым VI до 5 товаров.
- Если не найдем ни один популар, тогда показываем базовый VI

# <a name="homePageTemplate"></a> Шаблон для главной страницы

```html
<style type="text/css">
.rr-widget[data-s="{{data-retailrocket-markup-block}}"]{height:0;visibility:hidden;overflow:hidden;position:relative;display:block;width:100%;font-family:inherit;box-sizing:border-box}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"].rr-active{height:auto;visibility:visible;overflow:visible;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] *{outline:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-widget__title{font-size:18px;font-weight:700;color:#023f5d;text-align:left;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-items{position:relative;overflow:hidden;padding:0;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image{width:100%;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image img{width:auto;height:auto;max-width:100%;max-height:100%;vertical-align:middle;margin:0 auto;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-wrapper{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-box-sizing:content-box;box-sizing:content-box;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-slide{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;height:auto;position:relative;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item{padding:0 5px;text-align:center;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader{background:#fff;width:100%;height:100%;position:absolute;top:0;left:0;z-index:9;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader:after{display:block;content:'';background-image:url('https://rrstatic.retailrocket.net/widget/img/swiper_preloader.svg');background-position:50%;background-size:100%;background-repeat:no-repeat;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-ms-transform-origin:50%;transform-origin:50%;background-repeat:no-repeat;-webkit-animation:swiper-preloader-spin 1s steps(50, end) infinite;animation:swiper-preloader-spin 1s steps(50, end) infinite;}
@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__info{text-decoration:none;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title{display:inline-block;font-size:16px;font-weight:400;line-height:20px;color:#043e5e;height:40px;overflow:hidden;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title:hover{text-decoration:none;color:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__old-price{font-size:16px;font-weight:400;color:#023f5d;text-decoration:line-through;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price{font-size:16px;font-weight:400;color:#19addd;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price-currency::before{content:'₽ €'}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more{display:block;width:50%;padding:0 15px;background:#023f5d;color:#fff;font-size:14px;font-weight:400;line-height:35px;-webkit-border-radius:5px 0 0 5px;-moz-border-radius:5px 0 0 5px;border-radius:5px 0 0 5px;text-align:center;text-decoration:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more:hover{text-decoration:none;background:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy{font-size:14px;font-weight:400;line-height:35px;color:#fff;background-color:#19addd;padding:0 15px;text-align: center;display:block;text-decoration: none;-webkit-border-radius:0 5px 5px 0;-moz-border-radius:0 5px 5px 0;border-radius:0 5px 5px 0;width:50%;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy:hover{background-color:#2bc4f7}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-arrow{position:absolute;top:50%;-webkit-transform:translate(0, -50%);-moz-transform:translate(0, -50%);-ms-transform:translate(0, -50%);-o-transform:translate(0, -50%);transform:translate(0, -50%);background:url('https://rrstatic.retailrocket.net/widget/img/slider_arrow.svg') no-repeat center center;background-size:contain;width:30px;height:30px;display:block;-webkit-transition:all ease .3s;-moz-transition:all ease .3s;-ms-transition:all ease .3s;-o-transition:all ease .3s;transition:all ease .3s;cursor:pointer;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev{left:0;-webkit-transform:translate(0, -50%) rotate(180deg);-moz-transform:translate(0, -50%) rotate(180deg);-ms-transform:translate(0, -50%) rotate(180deg);-o-transform:translate(0, -50%) rotate(180deg);transform:translate(0, -50%) rotate(180deg);}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev:hover,
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next:hover{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next{right:0;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-arrow .swiper-button-disabled{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-button-lock{display:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-dots{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;justify-content:center;-webkit-justify-content:center;margin-top:10px;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet{border:solid 1px #19addd;width:12px;height:12px;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;margin:0 2px;cursor:pointer;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet.swiper-pagination-bullet-active{border-color:#023f5d;background:#023f5d;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullets.swiper-pagination-lock{display:none;}
</style>

<div
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm-type="visitor-category-interest"
  data-algorithm="popular"
  data-template-param-header-text="retailrocket"
  data-template-param-number-of-items="10"
  data-template-param-item-image-width="320"
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}"
></div>

<script id="widget-template-{{data-retailrocket-markup-block}}" type="text/html">
  <div class="rr-widget__title">
    <%=(headerText)%>
  </div>
  <div class="rr-items rr-swiper-container">
    <div class="rr-swiper-wrapper">
      <% for (var i = 0 ; i < numberOfItems; ++i) with(items[i]) { %>
      <div class="rr-swiper-slide">
        <div class="rr-item" data-id="<%=ItemId%>">
          <div class="rr-item__image">
            <a class="rr-item__info" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <img class="swiper-lazy"
                data-src="https://cdn.retailrocket.net/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=jpg&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both">
              <div class="swiper-lazy-preloader"></div>
            </a>
          </div>
          <div class="rr-item__name-block">
            <a class="rr-item__info rr-item__title" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <% if (Name.length > 26) { %>
              <%=Name.substr(0,26)+('...') %>
              <% } else { %>
              <%=Name %>
              <% } %>
            </a>
          </div>
          <div class="rr-item__block-price">
            <% if (OldPrice > Price) { %>
            <div class="rr-item__old-price"> <span
                class="rr-item__old-price-value"><%= retailrocket.widget.formatNumber(OldPrice, '.', ' ', 0) %></span>
              <span class="rr-item__price-currency"></span> </div>
            <% } %>
            <div class="rr-item__price"> <span
                class="rr-item__price-value"><%= retailrocket.widget.formatNumber(Price, '.', ' ', 0) %></span> <span
                class="rr-item__price-currency"></span> </div>
          </div>
          <div class="rr-item__actions">
            <a class="rr-item__actions-more" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>Подробнее</a>
            <a class="rr-item__actions-buy" href="<%=Url%>"
              onclick='rrApi.recomAddToCart(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });'>Купить</a>
          </div>
        </div>
      </div>
      <% } %>
    </div>
  </div>

  <div class="rr-slider-arrow">
    <a class="rr-arrow swiper-prev"></a>
    <div class="rr-slider-dots"></div>
    <a class="rr-arrow swiper-next"></a>
  </div>
</script>

<script type="text/javascript">
  /**
   * algorithm {String} - переменная, которая содержит название алгоритма, который ренедрится на странице
   * defaultAlgo {String} - переменная, которая содержит базовый алгоритм маркап-блока
   * SegmentID {String} - id сегмента для которого проводится АБ тестирование
   * setStatisticsRender {Function} - отправка события показа (отправлен markuprendered) блока с одним из алгоритмов
   * setStatisticsShow {Function} - отправа события просмотра (отправлен markuviewed) блока с одним из алгоритмов
   * setStatisticsClick {Function} - отправка события клика по товару в блоке (там же, где и onMouseDown)
   * ga {Function} - функия отправки события в Google Analitics независимо от рендера блока
   */

  (function (retailrocket) {
    'use strict';

    var waitFor = function (exitCondition, callback, force) {
      var checkCount = 100;
      var timeout = 1000;

      (function check() {
        var result = exitCondition();
        if (result) {
          callback(result);
          return;
        }

        if (checkCount === 0) {
          if (force) {
            callback();
          }
          return;
        }

        checkCount -= 1;
        setTimeout(check, timeout);
      })();
    };

    var SwiperModel = function (setting) {
      var $widget = setting.widget;
      var swiperSeector = '.rr-swiper-container';
      var source = 'https://rrstatic.retailrocket.net/widget/plugins/rrswiper/rrswiper.min.js';
      var itemsCount = $widget.getAttribute('data-number-of-rendered-items');

      function checkloop(paramsSlider) {
        var modSetting = paramsSlider;

        if (modSetting.loop == true) {
          for (var point in modSetting.breakpoints) {
            if (itemsCount <= modSetting.breakpoints[point].slidesPerView) {
              modSetting.breakpoints[point].loop = false;
            } else {
              modSetting.breakpoints[point].loop = true;
            }
          }
        }

        return modSetting;
      }

      function render(swiperLibrary) {
        var SwiperParams = checkloop(setting.settingSwiper);
        var $rrContainer = $widget.querySelector(swiperSeector);
        var rrSwiper = swiperLibrary == 'RRSwiper' ? new RRSwiper($rrContainer, SwiperParams) : new Swiper($rrContainer, SwiperParams);

        rrSwiper
          .on('init', function () {
            var $imgError = $widget.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate) img');
            var counter = 0;
            var indexImg = [];

            $imgError.forEach(function (img) {
              img.onerror = function () {
                var $slideItem = img.closest('.rr-swiper-slide');
                var $slideSiblings = $slideItem.parentNode.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate)');
                indexImg.push($slideItem.getAttribute('data-swiper-slide-index'));

                if ($imgError.length == counter) {
                  rrSwiper.removeSlide(indexImg);
                }
              };
              counter++;
            });
            $widget.classList.add('rr-active');
          })
          .on('observerUpdate', function () {
            rrSwiper.resize.resizeHandler();
          });
        rrSwiper.init();
      }

      function getScript() {
        var swiperJs = document.createElement('script');
        var getElemScript = document.getElementsByTagName('script')[0];
        swiperJs.async = 1;

        if (!window.Swiper && !window.RRSwiper) {
          swiperJs.onload = swiperJs.onreadystatechange = function (_,isAbort) {
            if (isAbort || !swiperJs.readyState || /loaded|complete/.test(swiperJs.readyState)) {
              swiperJs.onload = swiperJs.onreadystatechange = null;
              swiperJs = undefined;

              if (!isAbort) setTimeout(render('RRSwiper'), 0);
            }
          };

          swiperJs.src = source;
          getElemScript.parentNode.insertBefore(swiperJs, getElemScript);
        } else {
          var versionSwiper = window.hasOwnProperty('RRSwiper') ? 'RRSwiper' : 'Swiper';
          render(versionSwiper);
        }
      }

      this.getScript = getScript;
    };

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var algorithm = '',
        SPvendor = 'Oral-B',
        needRecomTrack = false,
        needCategories = [ 15140, 971984, 12417, 12659, 1758738, 1759956, 198746, 12660, 13195, 13372, 13382, 1340058, 13379, 13385, 13383, 1252587, 13378, 13386, 13376, 1166795, 1166793, 1239360, 12382, 14772, 14773, 14770, 20712, 2071001, 20706, 2463684633815360, 20705, 3010305, 301030502, 301030503, 301030501, 301030504, 70602, 7060209, 7060204, 7060206, 7060202, 7060201, 7060205, 7060210, 7060208, 2463684633845508, 2463684633845505];

      function getProductsId(products) {
        return products.map(function (product) {
          return product.ItemId;
        });
      }

      function setStatisticsRender(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockRender',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsShow(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockView',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsClick(itemId) {
        if (needRecomTrack) {
          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 0, [], {
              eventType: 'blockClick',
              clickedItem: itemId,
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function getItemsPopular(callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [0],
          'popular',
          {},
          callback
        );
      }

      function getItemsPopularByBrand(categoryIds, vendor, callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          categoryIds,
          'popular',
          { vendor: vendor },
          callback
        );
      }

      function getMatchingInfo(recoms) {
        var info = {
          flag: false,
          matchedCategories: [],
        };

        recoms.forEach(function (recom) {
          var categories = recom.CategoryPathsToRoot[0] || [];

          categories.some(function (category) {
            if (needCategories.indexOf(category) > -1 && info.matchedCategories.indexOf(category) == -1) {
              info.matchedCategories.push(category);
              info.flag = true;
            }
          });
        });

        if (info.flag) needRecomTrack = true;

        return info;
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
        var recomsInfo,
          defaultAlgo = widget.getAttribute('data-algorithm'),
          categoryMatchInfoVI = {},
          SPrecoms = [];

        getItemsPopular(function (itemsPopular) {
          recomsInfo = checkInterest(itemsPopular, recoms);

          if (recomsInfo.hasVI) {
            algorithm = 'SP' + SPvendor;
            categoryMatchInfoVI = JSON.parse(JSON.stringify(getMatchingInfo(recomsInfo.recoms)));
          } else {
            algorithm = defaultAlgo;
          }

          if (categoryMatchInfoVI.flag) {
            getItemsPopularByBrand(categoryMatchInfoVI.matchedCategories, SPvendor, function (popularItemsSP) {
                SPrecoms = popularItemsSP.slice(0);
                checkRender(SPrecoms, recomsInfo.recoms, defaultAlgo, renderFn);
              }
            );
          } else {
            checkRender(SPrecoms, recomsInfo.recoms, defaultAlgo, renderFn);
          }
        });
      }

      function checkRender(SPrecoms, defaultRecoms, defaultAlgo, renderFn) {
        var modRecoms, modSPrecoms;

        if (SPrecoms.length > 4) {
          modSPrecoms = SPrecoms.slice(0, 5);
          modRecoms = modSPrecoms.concat(defaultRecoms);
        } else if (SPrecoms.length > 0 && SPrecoms.length < 5) {
          modRecoms = SPrecoms.concat(defaultRecoms);
        } else {
          algorithm = defaultAlgo;
          modRecoms = defaultRecoms.slice(0);
        }

        render(modRecoms, renderFn);
      }

      function render(recoms, renderFn) {
        if (recoms.length > 4) {
          setStatisticsRender(recoms);
          renderFn(recoms);
        }
      }

      function postRenderFn(widget) {
        var products = widget.querySelectorAll('.rr-item');
        var isShow = false;
        var recoms = [];

        var rrSwiperCarousel = new SwiperModel({
          widget: widget,
          settingSwiper: {
            wrapperClass: 'rr-swiper-wrapper',
            slideClass: 'rr-swiper-slide',
            init: false,
            updateOnWindowResize: true,
            watchOverflow: true,
            observer: true,
            spaceBetween: 0,
            lazy: true,
            preloadImages: true,
            touchReleaseOnEdges: true,
            watchSlidesVisibility: true,
            loop: true,
            navigation: {
              prevEl: widget.querySelector('.swiper-prev'),
              nextEl: widget.querySelector('.swiper-next'),
            },
            pagination: {
              el: widget.querySelector('.rr-slider-dots'),
              type: 'bullets',
              clickable: true,
            },
            autoplay: false,
            speed: 800,
            breakpoints: {
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              500: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
              },
            },
          },
        });
        rrSwiperCarousel.getScript();

        products.forEach(function (item) {
          var product = {
            ItemId: item.getAttribute('data-id'),
          };

          recoms.push(product);
        });

        window.addEventListener('scroll', function () {
          if (!isShow) {
            var widgetScrollTop = widget.getBoundingClientRect()['top'];

            if (widgetScrollTop < 150) {
              setStatisticsShow(recoms);
              isShow = true;
            }
          }
        });
      }

      return {
        postRenderFn: postRenderFn,
        preRenderFn: preRenderFn,
        setStatisticsClick: setStatisticsClick,
      };
    })();

    waitFor(
      function () {
        return 'ga' in window && 'getAll' in window.ga;
      },
      function () {
        var trackerName = ga.getAll()[0].get('name');

        ga(
          trackerName + '.send',
          'event',
          'RRBlock',
          '', // <SegmentId>
          '{{data-retailrocket-markup-block}}',
          {
            nonInteraction: 1,
          }
        );
      }
    );

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="categoryPage"></a> Категория

### Техническое задание

Случай 1 Если id категории, который передается в блок, соответствует категориям из приложенного списка, показываем popular по бренду “Oral-B” по этим категориям в списке ниже.
Если таких товаров меньше 3, дополняем выдачей популярных товаров бренда по всему магазину до 3 товаров.
Случай 2 Если id категории, который передается в блок, не соответствует категории из приложенного списка, показываем базовую выдачу.

# <a name="categoryPageTemplate"></a> Шаблон для категории

```html
<style type="text/css">
.rr-widget[data-s="{{data-retailrocket-markup-block}}"]{height:0;visibility:hidden;overflow:hidden;position:relative;display:block;width:100%;font-family:inherit;box-sizing:border-box}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"].rr-active{height:auto;visibility:visible;overflow:visible;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] *{outline:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-widget__title{font-size:18px;font-weight:700;color:#023f5d;text-align:left;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-items{position:relative;overflow:hidden;padding:0;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image{width:100%;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image img{width:auto;height:auto;max-width:100%;max-height:100%;vertical-align:middle;margin:0 auto;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-wrapper{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-box-sizing:content-box;box-sizing:content-box;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-slide{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;height:auto;position:relative;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item{padding:0 5px;text-align:center;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader{background:#fff;width:100%;height:100%;position:absolute;top:0;left:0;z-index:9;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader:after{display:block;content:'';background-image:url('https://rrstatic.retailrocket.net/widget/img/swiper_preloader.svg');background-position:50%;background-size:100%;background-repeat:no-repeat;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-ms-transform-origin:50%;transform-origin:50%;background-repeat:no-repeat;-webkit-animation:swiper-preloader-spin 1s steps(50, end) infinite;animation:swiper-preloader-spin 1s steps(50, end) infinite;}
@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__info{text-decoration:none;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title{display:inline-block;font-size:16px;font-weight:400;line-height:20px;color:#043e5e;height:40px;overflow:hidden;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title:hover{text-decoration:none;color:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__old-price{font-size:16px;font-weight:400;color:#023f5d;text-decoration:line-through;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price{font-size:16px;font-weight:400;color:#19addd;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price-currency::before{content:'₽ €'}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more{display:block;width:50%;padding:0 15px;background:#023f5d;color:#fff;font-size:14px;font-weight:400;line-height:35px;-webkit-border-radius:5px 0 0 5px;-moz-border-radius:5px 0 0 5px;border-radius:5px 0 0 5px;text-align:center;text-decoration:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more:hover{text-decoration:none;background:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy{font-size:14px;font-weight:400;line-height:35px;color:#fff;background-color:#19addd;padding:0 15px;text-align: center;display:block;text-decoration: none;-webkit-border-radius:0 5px 5px 0;-moz-border-radius:0 5px 5px 0;border-radius:0 5px 5px 0;width:50%;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy:hover{background-color:#2bc4f7}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-arrow{position:absolute;top:50%;-webkit-transform:translate(0, -50%);-moz-transform:translate(0, -50%);-ms-transform:translate(0, -50%);-o-transform:translate(0, -50%);transform:translate(0, -50%);background:url('https://rrstatic.retailrocket.net/widget/img/slider_arrow.svg') no-repeat center center;background-size:contain;width:30px;height:30px;display:block;-webkit-transition:all ease .3s;-moz-transition:all ease .3s;-ms-transition:all ease .3s;-o-transition:all ease .3s;transition:all ease .3s;cursor:pointer;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev{left:0;-webkit-transform:translate(0, -50%) rotate(180deg);-moz-transform:translate(0, -50%) rotate(180deg);-ms-transform:translate(0, -50%) rotate(180deg);-o-transform:translate(0, -50%) rotate(180deg);transform:translate(0, -50%) rotate(180deg);}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev:hover,
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next:hover{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next{right:0;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-arrow .swiper-button-disabled{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-button-lock{display:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-dots{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;justify-content:center;-webkit-justify-content:center;margin-top:10px;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet{border:solid 1px #19addd;width:12px;height:12px;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;margin:0 2px;cursor:pointer;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet.swiper-pagination-bullet-active{border-color:#023f5d;background:#023f5d;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullets.swiper-pagination-lock{display:none;}
</style>

<div
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm="popular"
  data-algorithm-param-features="/PropertyInterests"
  data-algorithm-argument="{{data-category-id}}"
  data-template-param-header-text="retailrocket"
  data-template-param-number-of-items="6"
  data-template-param-item-image-width="320"
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}"
></div>

<script id="widget-template-{{data-retailrocket-markup-block}}" type="text/html">
  <div class="rr-widget__title">
    <%=(headerText)%>
  </div>
  <div class="rr-items rr-swiper-container">
    <div class="rr-swiper-wrapper">
      <% for (var i = 0 ; i < numberOfItems; ++i) with(items[i]) { %>
      <div class="rr-swiper-slide">
        <div class="rr-item" data-id="<%=ItemId%>">
          <div class="rr-item__image">
            <a class="rr-item__info" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <img class="swiper-lazy"
                data-src="https://cdn.retailrocket.net/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=jpg&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both">
              <div class="swiper-lazy-preloader"></div>
            </a>
          </div>
          <div class="rr-item__name-block">
            <a class="rr-item__info rr-item__title" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <% if (Name.length > 26) { %>
              <%=Name.substr(0,26)+('...') %>
              <% } else { %>
              <%=Name %>
              <% } %>
            </a>
          </div>
          <div class="rr-item__block-price">
            <% if (OldPrice > Price) { %>
            <div class="rr-item__old-price"> <span
                class="rr-item__old-price-value"><%= retailrocket.widget.formatNumber(OldPrice, '.', ' ', 0) %></span>
              <span class="rr-item__price-currency"></span> </div>
            <% } %>
            <div class="rr-item__price"> <span
                class="rr-item__price-value"><%= retailrocket.widget.formatNumber(Price, '.', ' ', 0) %></span> <span
                class="rr-item__price-currency"></span> </div>
          </div>
          <div class="rr-item__actions">
            <a class="rr-item__actions-more" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>Подробнее</a>
            <a class="rr-item__actions-buy" href="<%=Url%>"
              onclick='rrApi.recomAddToCart(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });'>Купить</a>
          </div>
        </div>
      </div>
      <% } %>
    </div>
  </div>

  <div class="rr-slider-arrow">
    <a class="rr-arrow swiper-prev"></a>
    <div class="rr-slider-dots"></div>
    <a class="rr-arrow swiper-next"></a>
  </div>
</script>

<script type="text/javascript">
  /**
   * algorithm {String} - переменная, которая содержит название алгоритма, который ренедрится на странице
   * defaultAlgo {String} - переменная, которая содержит базовый алгоритм маркап-блока
   * SegmentID {String} - id сегмента для которого проводится АБ тестирование
   * setStatisticsRender {Function} - отправка события показа (отправлен markuprendered) блока с одним из алгоритмов
   * setStatisticsShow {Function} - отправа события просмотра (отправлен markuviewed) блока с одним из алгоритмов
   * setStatisticsClick {Function} - отправка события клика по товару в блоке (там же, где и onMouseDown)
   * ga {Function} - функия отправки события в Google Analitics независимо от рендера блока
   */

  (function (retailrocket) {
    'use strict';

    var waitFor = function (exitCondition, callback, force) {
      var checkCount = 100;
      var timeout = 1000;

      (function check() {
        var result = exitCondition();
        if (result) {
          callback(result);
          return;
        }

        if (checkCount === 0) {
          if (force) {
            callback();
          }
          return;
        }

        checkCount -= 1;
        setTimeout(check, timeout);
      })();
    };

    var SwiperModel = function (setting) {
      var $widget = setting.widget;
      var swiperSeector = '.rr-swiper-container';
      var source = 'https://rrstatic.retailrocket.net/widget/plugins/rrswiper/rrswiper.min.js';
      var itemsCount = $widget.getAttribute('data-number-of-rendered-items');

      function checkloop(paramsSlider) {
        var modSetting = paramsSlider;

        if (modSetting.loop == true) {
          for (var point in modSetting.breakpoints) {
            if (itemsCount <= modSetting.breakpoints[point].slidesPerView) {
              modSetting.breakpoints[point].loop = false;
            } else {
              modSetting.breakpoints[point].loop = true;
            }
          }
        }

        return modSetting;
      }

      function render(swiperLibrary) {
        var SwiperParams = checkloop(setting.settingSwiper);
        var $rrContainer = $widget.querySelector(swiperSeector);
        var rrSwiper = swiperLibrary == 'RRSwiper' ? new RRSwiper($rrContainer, SwiperParams) : new Swiper($rrContainer, SwiperParams);

        rrSwiper
          .on('init', function () {
            var $imgError = $widget.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate) img');
            var counter = 0;
            var indexImg = [];

            $imgError.forEach(function (img) {
              img.onerror = function () {
                var $slideItem = img.closest('.rr-swiper-slide');
                var $slideSiblings = $slideItem.parentNode.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate)');
                indexImg.push($slideItem.getAttribute('data-swiper-slide-index'));

                if ($imgError.length == counter) {
                  rrSwiper.removeSlide(indexImg);
                }
              };
              counter++;
            });
            $widget.classList.add('rr-active');
          })
          .on('observerUpdate', function () {
            rrSwiper.resize.resizeHandler();
          });
        rrSwiper.init();
      }

      function getScript() {
        var swiperJs = document.createElement('script');
        var getElemScript = document.getElementsByTagName('script')[0];
        swiperJs.async = 1;

        if (!window.Swiper && !window.RRSwiper) {
          swiperJs.onload = swiperJs.onreadystatechange = function (_,isAbort) {
            if (isAbort || !swiperJs.readyState || /loaded|complete/.test(swiperJs.readyState)) {
              swiperJs.onload = swiperJs.onreadystatechange = null;
              swiperJs = undefined;

              if (!isAbort) setTimeout(render('RRSwiper'), 0);
            }
          };

          swiperJs.src = source;
          getElemScript.parentNode.insertBefore(swiperJs, getElemScript);
        } else {
          var versionSwiper = window.hasOwnProperty('RRSwiper') ? 'RRSwiper' : 'Swiper';
          render(versionSwiper);
        }
      }

      this.getScript = getScript;
    };

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var algorithm = '',
        SPvendor = 'Oral-B',
        needRecomTrack = false,
        needCategories = [ 15140, 971984, 12417, 12659, 1758738, 1759956, 198746, 12660, 13195, 13372, 13382, 1340058, 13379, 13385, 13383, 1252587, 13378, 13386, 13376, 1166795, 1166793, 1239360, 12382, 14772, 14773, 14770, 20712, 2071001, 20706, 2463684633815360, 20705, 3010305, 301030502, 301030503, 301030501, 301030504, 70602, 7060209, 7060204, 7060206, 7060202, 7060201, 7060205, 7060210, 7060208, 2463684633845508, 2463684633845505],
        pageCategory = '{{data-category-id}}';

      function getProductsId(products) {
        return products.map(function (product) {
          return product.ItemId;
        });
      }

      function setStatisticsRender(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockRender',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsShow(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockView',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsClick(itemId) {
        if (needRecomTrack) {
          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 0, [], {
              eventType: 'blockClick',
              clickedItem: itemId,
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function getItemsPopular(callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [0],
          'popular',
          {},
          callback
        );
      }

      function getItemsPopularByBrand(categoryIds, vendor, callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [categoryIds],
          'popular',
          { vendor: vendor },
          callback
        );
      }

      function checkCategoryMatch() {
        return needCategories.some(function (category) {
          return category == pageCategory;
        });
      }

      function preRenderFn(widget, recoms, renderFn) {
        var SPalgo = 'SP' + SPvendor,
          defaultAlgo = widget.getAttribute('data-algorithm'),
          categoryMatch = checkCategoryMatch();

        if (categoryMatch) {
          algorithm = SPalgo;
          needRecomTrack = true;
          getItemsPopularByBrand(pageCategory, SPvendor, function (popularBrandItems) {
            checkRender(popularBrandItems, recoms, defaultAlgo, renderFn);
          });
        } else {
          algorithm = defaultAlgo;
          render(recoms, renderFn);
        }
      }

      function checkRender(SPrecoms, defaultRecoms, defaultAlgo, renderFn) {
        var modRecoms, modSPrecoms;

        if (SPrecoms.length > 2) {
          modSPrecoms = SPrecoms.slice(0, 3);
          modRecoms = modSPrecoms.concat(defaultRecoms);
          render(modRecoms, renderFn);
        } else {
          getItemsPopularByBrand(0, SPvendor, function (storePopularItems) {
            var filteredStorePopularRecoms = storePopularItems.slice(0, 3);

            if (filteredStorePopularRecoms.length === 0)
              algorithm = defaultAlgo;

            modRecoms = SPrecoms.concat(
              filteredStorePopularRecoms,
              defaultRecoms
            );
            render(modRecoms, renderFn);
          });
        }
      }

      function render(recoms, renderFn) {
        if (recoms.length > 5) {
          setStatisticsRender(recoms);
          renderFn(recoms);
        }
      }

      function postRenderFn(widget) {
        var products = widget.querySelectorAll('.rr-item');
        var isShow = false;
        var recoms = [];

        var rrSwiperCarousel = new SwiperModel({
          widget: widget,
          settingSwiper: {
            wrapperClass: 'rr-swiper-wrapper',
            slideClass: 'rr-swiper-slide',
            init: false,
            updateOnWindowResize: true,
            watchOverflow: true,
            observer: true,
            spaceBetween: 0,
            lazy: true,
            preloadImages: true,
            touchReleaseOnEdges: true,
            watchSlidesVisibility: true,
            loop: true,
            navigation: {
              prevEl: widget.querySelector('.swiper-prev'),
              nextEl: widget.querySelector('.swiper-next'),
            },
            pagination: {
              el: widget.querySelector('.rr-slider-dots'),
              type: 'bullets',
              clickable: true,
            },
            autoplay: false,
            speed: 800,
            breakpoints: {
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              500: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
              },
            },
          },
        });
        rrSwiperCarousel.getScript();

        products.forEach(function (item) {
          var product = {
            ItemId: item.getAttribute('data-id'),
          };

          recoms.push(product);
        });

        window.addEventListener('scroll', function () {
          if (!isShow) {
            var widgetScrollTop = widget.getBoundingClientRect()['top'];

            if (widgetScrollTop < 150) {
              setStatisticsShow(recoms);
              isShow = true;
            }
          }
        });
      }

      return {
        postRenderFn: postRenderFn,
        preRenderFn: preRenderFn,
        setStatisticsClick: setStatisticsClick,
      };
    })();

    waitFor(
      function () {
        return 'ga' in window && 'getAll' in window.ga;
      },
      function () {
        var trackerName = ga.getAll()[0].get('name');

        ga(
          trackerName + '.send',
          'event',
          'RRBlock',
          '', // <SegmentId>
          '{{data-retailrocket-markup-block}}',
          {
            nonInteraction: 1,
          }
        );
      }
    );

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="cardPage"></a> Карточка товара

### Техническое задание

Описание логики для SP:

Смотрим id товара, который передается в блок.

Cмотрим его categoryIDs.

Случай 1 Если в categoryIDs нет категорий из списка ниже, показываем базовую выдачу Alternative.

Случай 2 Если в categoryIDs есть категории из списка ниже:

- Если товаров меньше 5, добиваем popular по по бренду по всему магазину.
- Если товаров все еще меньше 5, добиваем базовым Alternative до 5 товаров.

# <a name="cardPageTemplate"></a> Шаблон для карточки товара

```html
<style type="text/css">
.rr-widget[data-s="{{data-retailrocket-markup-block}}"]{height:0;visibility:hidden;overflow:hidden;position:relative;display:block;width:100%;font-family:inherit;box-sizing:border-box}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"].rr-active{height:auto;visibility:visible;overflow:visible;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] *{outline:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-widget__title{font-size:18px;font-weight:700;color:#023f5d;text-align:left;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-items{position:relative;overflow:hidden;padding:0;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image{width:100%;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image img{width:auto;height:auto;max-width:100%;max-height:100%;vertical-align:middle;margin:0 auto;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-wrapper{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-box-sizing:content-box;box-sizing:content-box;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-slide{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;height:auto;position:relative;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item{padding:0 5px;text-align:center;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader{background:#fff;width:100%;height:100%;position:absolute;top:0;left:0;z-index:9;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader:after{display:block;content:'';background-image:url('https://rrstatic.retailrocket.net/widget/img/swiper_preloader.svg');background-position:50%;background-size:100%;background-repeat:no-repeat;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-ms-transform-origin:50%;transform-origin:50%;background-repeat:no-repeat;-webkit-animation:swiper-preloader-spin 1s steps(50, end) infinite;animation:swiper-preloader-spin 1s steps(50, end) infinite;}
@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__info{text-decoration:none;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title{display:inline-block;font-size:16px;font-weight:400;line-height:20px;color:#043e5e;height:40px;overflow:hidden;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title:hover{text-decoration:none;color:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__old-price{font-size:16px;font-weight:400;color:#023f5d;text-decoration:line-through;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price{font-size:16px;font-weight:400;color:#19addd;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price-currency::before{content:'₽ €'}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more{display:block;width:50%;padding:0 15px;background:#023f5d;color:#fff;font-size:14px;font-weight:400;line-height:35px;-webkit-border-radius:5px 0 0 5px;-moz-border-radius:5px 0 0 5px;border-radius:5px 0 0 5px;text-align:center;text-decoration:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more:hover{text-decoration:none;background:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy{font-size:14px;font-weight:400;line-height:35px;color:#fff;background-color:#19addd;padding:0 15px;text-align: center;display:block;text-decoration: none;-webkit-border-radius:0 5px 5px 0;-moz-border-radius:0 5px 5px 0;border-radius:0 5px 5px 0;width:50%;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy:hover{background-color:#2bc4f7}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-arrow{position:absolute;top:50%;-webkit-transform:translate(0, -50%);-moz-transform:translate(0, -50%);-ms-transform:translate(0, -50%);-o-transform:translate(0, -50%);transform:translate(0, -50%);background:url('https://rrstatic.retailrocket.net/widget/img/slider_arrow.svg') no-repeat center center;background-size:contain;width:30px;height:30px;display:block;-webkit-transition:all ease .3s;-moz-transition:all ease .3s;-ms-transition:all ease .3s;-o-transition:all ease .3s;transition:all ease .3s;cursor:pointer;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev{left:0;-webkit-transform:translate(0, -50%) rotate(180deg);-moz-transform:translate(0, -50%) rotate(180deg);-ms-transform:translate(0, -50%) rotate(180deg);-o-transform:translate(0, -50%) rotate(180deg);transform:translate(0, -50%) rotate(180deg);}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev:hover,
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next:hover{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next{right:0;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-arrow .swiper-button-disabled{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-button-lock{display:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-dots{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;justify-content:center;-webkit-justify-content:center;margin-top:10px;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet{border:solid 1px #19addd;width:12px;height:12px;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;margin:0 2px;cursor:pointer;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet.swiper-pagination-bullet-active{border-color:#023f5d;background:#023f5d;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullets.swiper-pagination-lock{display:none;}
</style>

<div
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm="alternative"
  data-algorithm-argument="{{data-product-id}}"
  data-template-param-header-text="retailrocket"
  data-template-param-number-of-items="15"
  data-template-param-item-image-width="320"
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}"
></div>

<script id="widget-template-{{data-retailrocket-markup-block}}" type="text/html">
  <div class="rr-widget__title">
    <%=(headerText)%>
  </div>
  <div class="rr-items rr-swiper-container">
    <div class="rr-swiper-wrapper">
      <% for (var i = 0 ; i < numberOfItems; ++i) with(items[i]) { %>
      <div class="rr-swiper-slide">
        <div class="rr-item" data-id="<%=ItemId%>">
          <div class="rr-item__image">
            <a class="rr-item__info" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <img class="swiper-lazy"
                data-src="https://cdn.retailrocket.net/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=jpg&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both">
              <div class="swiper-lazy-preloader"></div>
            </a>
          </div>
          <div class="rr-item__name-block">
            <a class="rr-item__info rr-item__title" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <% if (Name.length > 26) { %>
              <%=Name.substr(0,26)+('...') %>
              <% } else { %>
              <%=Name %>
              <% } %>
            </a>
          </div>
          <div class="rr-item__block-price">
            <% if (OldPrice > Price) { %>
            <div class="rr-item__old-price"> <span
                class="rr-item__old-price-value"><%= retailrocket.widget.formatNumber(OldPrice, '.', ' ', 0) %></span>
              <span class="rr-item__price-currency"></span> </div>
            <% } %>
            <div class="rr-item__price"> <span
                class="rr-item__price-value"><%= retailrocket.widget.formatNumber(Price, '.', ' ', 0) %></span> <span
                class="rr-item__price-currency"></span> </div>
          </div>
          <div class="rr-item__actions">
            <a class="rr-item__actions-more" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>Подробнее</a>
            <a class="rr-item__actions-buy" href="<%=Url%>"
              onclick='rrApi.recomAddToCart(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });'>Купить</a>
          </div>
        </div>
      </div>
      <% } %>
    </div>
  </div>

  <div class="rr-slider-arrow">
    <a class="rr-arrow swiper-prev"></a>
    <div class="rr-slider-dots"></div>
    <a class="rr-arrow swiper-next"></a>
  </div>
</script>

<script type="text/javascript">
  /**
   * algorithm {String} - переменная, которая содержит название алгоритма, который ренедрится на странице
   * defaultAlgo {String} - переменная, которая содержит базовый алгоритм маркап-блока
   * SegmentID {String} - id сегмента для которого проводится АБ тестирование
   * setStatisticsRender {Function} - отправка события показа (отправлен markuprendered) блока с одним из алгоритмов
   * setStatisticsShow {Function} - отправа события просмотра (отправлен markuviewed) блока с одним из алгоритмов
   * setStatisticsClick {Function} - отправка события клика по товару в блоке (там же, где и onMouseDown)
   * ga {Function} - функия отправки события в Google Analitics независимо от рендера блока
   */

  (function (retailrocket) {
    'use strict';

    var waitFor = function (exitCondition, callback, force) {
      var checkCount = 100;
      var timeout = 1000;

      (function check() {
        var result = exitCondition();
        if (result) {
          callback(result);
          return;
        }

        if (checkCount === 0) {
          if (force) {
            callback();
          }
          return;
        }

        checkCount -= 1;
        setTimeout(check, timeout);
      })();
    };

    var SwiperModel = function (setting) {
      var $widget = setting.widget;
      var swiperSeector = '.rr-swiper-container';
      var source = 'https://rrstatic.retailrocket.net/widget/plugins/rrswiper/rrswiper.min.js';
      var itemsCount = $widget.getAttribute('data-number-of-rendered-items');

      function checkloop(paramsSlider) {
        var modSetting = paramsSlider;

        if (modSetting.loop == true) {
          for (var point in modSetting.breakpoints) {
            if (itemsCount <= modSetting.breakpoints[point].slidesPerView) {
              modSetting.breakpoints[point].loop = false;
            } else {
              modSetting.breakpoints[point].loop = true;
            }
          }
        }

        return modSetting;
      }

      function render(swiperLibrary) {
        var SwiperParams = checkloop(setting.settingSwiper);
        var $rrContainer = $widget.querySelector(swiperSeector);
        var rrSwiper = swiperLibrary == 'RRSwiper' ? new RRSwiper($rrContainer, SwiperParams) : new Swiper($rrContainer, SwiperParams);

        rrSwiper
          .on('init', function () {
            var $imgError = $widget.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate) img');
            var counter = 0;
            var indexImg = [];

            $imgError.forEach(function (img) {
              img.onerror = function () {
                var $slideItem = img.closest('.rr-swiper-slide');
                var $slideSiblings = $slideItem.parentNode.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate)');
                indexImg.push($slideItem.getAttribute('data-swiper-slide-index'));

                if ($imgError.length == counter) {
                  rrSwiper.removeSlide(indexImg);
                }
              };
              counter++;
            });
            $widget.classList.add('rr-active');
          })
          .on('observerUpdate', function () {
            rrSwiper.resize.resizeHandler();
          });
        rrSwiper.init();
      }

      function getScript() {
        var swiperJs = document.createElement('script');
        var getElemScript = document.getElementsByTagName('script')[0];
        swiperJs.async = 1;

        if (!window.Swiper && !window.RRSwiper) {
          swiperJs.onload = swiperJs.onreadystatechange = function (_,isAbort) {
            if (isAbort || !swiperJs.readyState || /loaded|complete/.test(swiperJs.readyState)) {
              swiperJs.onload = swiperJs.onreadystatechange = null;
              swiperJs = undefined;

              if (!isAbort) setTimeout(render('RRSwiper'), 0);
            }
          };

          swiperJs.src = source;
          getElemScript.parentNode.insertBefore(swiperJs, getElemScript);
        } else {
          var versionSwiper = window.hasOwnProperty('RRSwiper') ? 'RRSwiper' : 'Swiper';
          render(versionSwiper);
        }
      }

      this.getScript = getScript;
    };

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var algorithm = '',
        SPvendor = 'Oral-B',
        needRecomTrack = false,
        needCategories = [ 15140, 971984, 12417, 12659, 1758738, 1759956, 198746, 12660, 13195, 13372, 13382, 1340058, 13379, 13385, 13383, 1252587, 13378, 13386, 13376, 1166795, 1166793, 1239360, 12382, 14772, 14773, 14770, 20712, 2071001, 20706, 2463684633815360, 20705, 3010305, 301030502, 301030503, 301030501, 301030504, 70602, 7060209, 7060204, 7060206, 7060202, 7060201, 7060205, 7060210, 7060208, 2463684633845508, 2463684633845505];

      function getProductsId(products) {
        return products.map(function (product) {
          return product.ItemId;
        });
      }

      function setStatisticsRender(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockRender',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsShow(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockView',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsClick(itemId) {
        if (needRecomTrack) {
          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 0, [], {
              eventType: 'blockClick',
              clickedItem: itemId,
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function getItems(requireProducts, callback) {
        retailrocket.items.get(
          retailrocket.api.getPartnerId(),
          requireProducts,
          callback
        );
      }

      function getItemsPopular(categoryIdFind, callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [categoryIdFind],
          'popular',
          {},
          callback
        );
      }

      function getItemsPopularByBrand(categoryIds, vendor, callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [categoryIds],
          'popular',
          { vendor: vendor },
          callback
        );
      }

      function checkCategoryMatch(pageCategory) {
        return needCategories.some(function (category) {
          return category == pageCategory;
        });
      }

      function filterId(recom) {
        return recom.ItemId != '{{data-product-id}}';
      }

      function filterSPbrand(recoms) {
        return recoms.filter(function (recom) {
          return recom.Vendor == SPvendor;
        });
      }

      function filterDefaultBrands(recoms) {
        return recoms.filter(function (recom) {
          return recom.Vendor != SPvendor;
        });
      }

      function preRenderFn(widget, recoms, renderFn) {
        var modRecoms = [],
          SPrecoms = [],
          filteredRecoms = [],
          SPalgo = 'SP' + SPvendor,
          defaultAlgo = widget.getAttribute('data-algorithm'),
          limit = Number(widget.getAttribute('data-template-param-number-of-items')),
          minimumNumber = limit / 3,
          productList = ['{{data-product-id}}'],
          recomsAlt = recoms.filter(filterId),
          category,
          categoryMatch;

        getItems(productList, function (currentProducts) {
          category = currentProducts[0].CategoryIds[currentProducts[0].CategoryIds.length - 1];
          categoryMatch = checkCategoryMatch(category);

          if (categoryMatch) {
            algorithm = SPalgo;
            needRecomTrack = true;
            SPrecoms = filterSPbrand(recomsAlt);
            filteredRecoms = filterDefaultBrands(recomsAlt);
            checkSPrender(SPrecoms, filteredRecoms, category, minimumNumber, limit, defaultAlgo, renderFn);
          } else {
            algorithm = defaultAlgo;
            checkDefaultRender(recomsAlt, category, minimumNumber, limit, renderFn);
          }
        });
      }

      function checkSPrender( SPrecoms, defaultRecoms, category, minimumNumber, limit, defaultAlgo, renderFn) {
        var modSPrecoms = [];

        if (SPrecoms.length > minimumNumber - 1) {
          modSPrecoms = SPrecoms.slice(0, minimumNumber).concat(defaultRecoms);
          checkDefaultRender(modSPrecoms, category, minimumNumber, limit, renderFn);
        } else {
          getItemsPopularByBrand(0, SPvendor, function (popularBrandRecoms) {
            var filledRecoms;

            modSPrecoms = SPrecoms.concat(popularBrandRecoms);

            if (modSPrecoms.length === 0) algorithm = defaultAlgo;

            if (modSPrecoms.length > minimumNumber - 1) {
              filledRecoms = modSPrecoms.slice(0, minimumNumber).concat(defaultRecoms);
            } else {
              filledRecoms = modSPrecoms.concat(defaultRecoms).slice(0, limit);
            }

            checkDefaultRender(filledRecoms, category, minimumNumber, limit, renderFn);
          });
        }
      }

      function checkDefaultRender(recoms, category, minimumNumber, limit, renderFn) {
        if (recoms.length > limit - 1) {
          render(recoms, minimumNumber, renderFn);
        } else {
          var modRecoms;

          getItemsPopular(category, function (itemsPopular) {
            var filteredItemsPopular = itemsPopular.filter(filterId);

            modRecoms = recoms.concat(filteredItemsPopular);

            render(modRecoms, minimumNumber, renderFn);
          });
        }
      }

      function render(recoms, minimumNumber, renderFn) {
        if (recoms.length > minimumNumber - 1) {
          setStatisticsRender(recoms);
          renderFn(recoms);
        }
      }

      function postRenderFn(widget) {
        var products = widget.querySelectorAll('.rr-item');
        var isShow = false;
        var recoms = [];

        var rrSwiperCarousel = new SwiperModel({
          widget: widget,
          settingSwiper: {
            wrapperClass: 'rr-swiper-wrapper',
            slideClass: 'rr-swiper-slide',
            init: false,
            updateOnWindowResize: true,
            watchOverflow: true,
            observer: true,
            spaceBetween: 0,
            lazy: true,
            preloadImages: true,
            touchReleaseOnEdges: true,
            watchSlidesVisibility: true,
            loop: true,
            navigation: {
              prevEl: widget.querySelector('.swiper-prev'),
              nextEl: widget.querySelector('.swiper-next'),
            },
            pagination: {
              el: widget.querySelector('.rr-slider-dots'),
              type: 'bullets',
              clickable: true,
            },
            autoplay: false,
            speed: 800,
            breakpoints: {
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              500: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
              },
            },
          },
        });
        rrSwiperCarousel.getScript();

        products.forEach(function (item) {
          var product = {
            ItemId: item.getAttribute('data-id'),
          };

          recoms.push(product);
        });

        window.addEventListener('scroll', function () {
          if (!isShow) {
            var widgetScrollTop = widget.getBoundingClientRect()['top'];

            if (widgetScrollTop < 150) {
              setStatisticsShow(recoms);
              isShow = true;
            }
          }
        });
      }

      return {
        postRenderFn: postRenderFn,
        preRenderFn: preRenderFn,
        setStatisticsClick: setStatisticsClick,
      };
    })();

    waitFor(
      function () {
        return 'ga' in window && 'getAll' in window.ga;
      },
      function () {
        var trackerName = ga.getAll()[0].get('name');

        ga(
          trackerName + '.send',
          'event',
          'RRBlock',
          '', // <SegmentId>
          '{{data-retailrocket-markup-block}}',
          {
            nonInteraction: 1,
          }
        );
      }
    );

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="searchPage"></a> Поиск

### Техническое задание

Запрашиваем Search по запросу пользователя.

Получаем выдачу Search.

Берем первый товар, смотрим его categoryPathToRoot.

СЛУЧАЙ 1 Если в categoryPathToRoot есть категории из списка ниже: Строим popular по бренду “Oral-B” по этим категориям.

СЛУЧАЙ 2 Если в categoryPathToRoot нет категорий из приложенного списка, берем следующий товар и так до конца выдачи.

СЛУЧАЙ 3 Если ни один товар не соответствует условиям выше, запрашиваем выдачу VI и повторяем логику как на главной.

СЛУЧАЙ 4 Если ни один товар не соответствует условиям выше, оставляем базовую выдачу блока.

# <a name="searchPageTemplate"></a> Шаблон для поиска

```html
<style type="text/css">
.rr-widget[data-s="{{data-retailrocket-markup-block}}"]{height:0;visibility:hidden;overflow:hidden;position:relative;display:block;width:100%;font-family:inherit;box-sizing:border-box}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"].rr-active{height:auto;visibility:visible;overflow:visible;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] *{outline:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-widget__title{font-size:18px;font-weight:700;color:#023f5d;text-align:left;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-items{position:relative;overflow:hidden;padding:0;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image{width:100%;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image img{width:auto;height:auto;max-width:100%;max-height:100%;vertical-align:middle;margin:0 auto;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-wrapper{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-box-sizing:content-box;box-sizing:content-box;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-slide{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;height:auto;position:relative;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item{padding:0 5px;text-align:center;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader{background:#fff;width:100%;height:100%;position:absolute;top:0;left:0;z-index:9;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader:after{display:block;content:'';background-image:url('https://rrstatic.retailrocket.net/widget/img/swiper_preloader.svg');background-position:50%;background-size:100%;background-repeat:no-repeat;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-ms-transform-origin:50%;transform-origin:50%;background-repeat:no-repeat;-webkit-animation:swiper-preloader-spin 1s steps(50, end) infinite;animation:swiper-preloader-spin 1s steps(50, end) infinite;}
@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__info{text-decoration:none;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title{display:inline-block;font-size:16px;font-weight:400;line-height:20px;color:#043e5e;height:40px;overflow:hidden;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title:hover{text-decoration:none;color:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__old-price{font-size:16px;font-weight:400;color:#023f5d;text-decoration:line-through;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price{font-size:16px;font-weight:400;color:#19addd;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price-currency::before{content:'₽ €'}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more{display:block;width:50%;padding:0 15px;background:#023f5d;color:#fff;font-size:14px;font-weight:400;line-height:35px;-webkit-border-radius:5px 0 0 5px;-moz-border-radius:5px 0 0 5px;border-radius:5px 0 0 5px;text-align:center;text-decoration:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more:hover{text-decoration:none;background:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy{font-size:14px;font-weight:400;line-height:35px;color:#fff;background-color:#19addd;padding:0 15px;text-align: center;display:block;text-decoration: none;-webkit-border-radius:0 5px 5px 0;-moz-border-radius:0 5px 5px 0;border-radius:0 5px 5px 0;width:50%;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy:hover{background-color:#2bc4f7}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-arrow{position:absolute;top:50%;-webkit-transform:translate(0, -50%);-moz-transform:translate(0, -50%);-ms-transform:translate(0, -50%);-o-transform:translate(0, -50%);transform:translate(0, -50%);background:url('https://rrstatic.retailrocket.net/widget/img/slider_arrow.svg') no-repeat center center;background-size:contain;width:30px;height:30px;display:block;-webkit-transition:all ease .3s;-moz-transition:all ease .3s;-ms-transition:all ease .3s;-o-transition:all ease .3s;transition:all ease .3s;cursor:pointer;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev{left:0;-webkit-transform:translate(0, -50%) rotate(180deg);-moz-transform:translate(0, -50%) rotate(180deg);-ms-transform:translate(0, -50%) rotate(180deg);-o-transform:translate(0, -50%) rotate(180deg);transform:translate(0, -50%) rotate(180deg);}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev:hover,
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next:hover{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next{right:0;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-arrow .swiper-button-disabled{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-button-lock{display:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-dots{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;justify-content:center;-webkit-justify-content:center;margin-top:10px;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet{border:solid 1px #19addd;width:12px;height:12px;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;margin:0 2px;cursor:pointer;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet.swiper-pagination-bullet-active{border-color:#023f5d;background:#023f5d;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullets.swiper-pagination-lock{display:none;}
</style>

<div
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm="search"
  data-algorithm-param-version="9"
  data-algorithm-param-features="/PropertyInterests"
  data-algorithm-argument="{{data-search-phrase}}"
  data-template-param-header-text="retailrocket"
  data-template-param-number-of-items="3"
  data-template-param-item-image-width="320"
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}"
></div>

<script id="widget-template-{{data-retailrocket-markup-block}}" type="text/html">
  <div class="rr-widget__title">
    <%=(headerText)%>
  </div>
  <div class="rr-items rr-swiper-container">
    <div class="rr-swiper-wrapper">
      <% for (var i = 0 ; i < numberOfItems; ++i) with(items[i]) { %>
      <div class="rr-swiper-slide">
        <div class="rr-item" data-id="<%=ItemId%>">
          <div class="rr-item__image">
            <a class="rr-item__info" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <img class="swiper-lazy"
                data-src="https://cdn.retailrocket.net/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=jpg&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both">
              <div class="swiper-lazy-preloader"></div>
            </a>
          </div>
          <div class="rr-item__name-block">
            <a class="rr-item__info rr-item__title" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <% if (Name.length > 26) { %>
              <%=Name.substr(0,26)+('...') %>
              <% } else { %>
              <%=Name %>
              <% } %>
            </a>
          </div>
          <div class="rr-item__block-price">
            <% if (OldPrice > Price) { %>
            <div class="rr-item__old-price"> <span
                class="rr-item__old-price-value"><%= retailrocket.widget.formatNumber(OldPrice, '.', ' ', 0) %></span>
              <span class="rr-item__price-currency"></span> </div>
            <% } %>
            <div class="rr-item__price"> <span
                class="rr-item__price-value"><%= retailrocket.widget.formatNumber(Price, '.', ' ', 0) %></span> <span
                class="rr-item__price-currency"></span> </div>
          </div>
          <div class="rr-item__actions">
            <a class="rr-item__actions-more" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>Подробнее</a>
            <a class="rr-item__actions-buy" href="<%=Url%>"
              onclick='rrApi.recomAddToCart(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });'>Купить</a>
          </div>
        </div>
      </div>
      <% } %>
    </div>
  </div>

  <div class="rr-slider-arrow">
    <a class="rr-arrow swiper-prev"></a>
    <div class="rr-slider-dots"></div>
    <a class="rr-arrow swiper-next"></a>
  </div>
</script>

<script type="text/javascript">
  /**
   * algorithm {String} - переменная, которая содержит название алгоритма, который ренедрится на странице
   * defaultAlgo {String} - переменная, которая содержит базовый алгоритм маркап-блока
   * SegmentID {String} - id сегмента для которого проводится АБ тестирование
   * setStatisticsRender {Function} - отправка события показа (отправлен markuprendered) блока с одним из алгоритмов
   * setStatisticsShow {Function} - отправа события просмотра (отправлен markuviewed) блока с одним из алгоритмов
   * setStatisticsClick {Function} - отправка события клика по товару в блоке (там же, где и onMouseDown)
   * ga {Function} - функия отправки события в Google Analitics независимо от рендера блока
   */

  (function (retailrocket) {
    'use strict';

    var waitFor = function (exitCondition, callback, force) {
      var checkCount = 100;
      var timeout = 1000;

      (function check() {
        var result = exitCondition();
        if (result) {
          callback(result);
          return;
        }

        if (checkCount === 0) {
          if (force) {
            callback();
          }
          return;
        }

        checkCount -= 1;
        setTimeout(check, timeout);
      })();
    };

    var SwiperModel = function (setting) {
      var $widget = setting.widget;
      var swiperSeector = '.rr-swiper-container';
      var source = 'https://rrstatic.retailrocket.net/widget/plugins/rrswiper/rrswiper.min.js';
      var itemsCount = $widget.getAttribute('data-number-of-rendered-items');

      function checkloop(paramsSlider) {
        var modSetting = paramsSlider;

        if (modSetting.loop == true) {
          for (var point in modSetting.breakpoints) {
            if (itemsCount <= modSetting.breakpoints[point].slidesPerView) {
              modSetting.breakpoints[point].loop = false;
            } else {
              modSetting.breakpoints[point].loop = true;
            }
          }
        }

        return modSetting;
      }

      function render(swiperLibrary) {
        var SwiperParams = checkloop(setting.settingSwiper);
        var $rrContainer = $widget.querySelector(swiperSeector);
        var rrSwiper = swiperLibrary == 'RRSwiper' ? new RRSwiper($rrContainer, SwiperParams) : new Swiper($rrContainer, SwiperParams);

        rrSwiper
          .on('init', function () {
            var $imgError = $widget.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate) img');
            var counter = 0;
            var indexImg = [];

            $imgError.forEach(function (img) {
              img.onerror = function () {
                var $slideItem = img.closest('.rr-swiper-slide');
                var $slideSiblings = $slideItem.parentNode.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate)');
                indexImg.push($slideItem.getAttribute('data-swiper-slide-index'));

                if ($imgError.length == counter) {
                  rrSwiper.removeSlide(indexImg);
                }
              };
              counter++;
            });
            $widget.classList.add('rr-active');
          })
          .on('observerUpdate', function () {
            rrSwiper.resize.resizeHandler();
          });
        rrSwiper.init();
      }

      function getScript() {
        var swiperJs = document.createElement('script');
        var getElemScript = document.getElementsByTagName('script')[0];
        swiperJs.async = 1;

        if (!window.Swiper && !window.RRSwiper) {
          swiperJs.onload = swiperJs.onreadystatechange = function (_,isAbort) {
            if (isAbort || !swiperJs.readyState || /loaded|complete/.test(swiperJs.readyState)) {
              swiperJs.onload = swiperJs.onreadystatechange = null;
              swiperJs = undefined;

              if (!isAbort) setTimeout(render('RRSwiper'), 0);
            }
          };

          swiperJs.src = source;
          getElemScript.parentNode.insertBefore(swiperJs, getElemScript);
        } else {
          var versionSwiper = window.hasOwnProperty('RRSwiper') ? 'RRSwiper' : 'Swiper';
          render(versionSwiper);
        }
      }

      this.getScript = getScript;
    };

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var algorithm = '',
        SPvendor = 'Oral-B',
        needRecomTrack = false,
        needCategories = [ 15140, 971984, 12417, 12659, 1758738, 1759956, 198746, 12660, 13195, 13372, 13382, 1340058, 13379, 13385, 13383, 1252587, 13378, 13386, 13376, 1166795, 1166793, 1239360, 12382, 14772, 14773, 14770, 20712, 2071001, 20706, 2463684633815360, 20705, 3010305, 301030502, 301030503, 301030501, 301030504, 70602, 7060209, 7060204, 7060206, 7060202, 7060201, 7060205, 7060210, 7060208, 2463684633845508, 2463684633845505];

      function getProductsId(products) {
        return products.map(function (product) {
          return product.ItemId;
        });
      }

      function setStatisticsRender(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockRender',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsShow(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockView',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsClick(itemId) {
        if (needRecomTrack) {
          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 0, [], {
              eventType: 'blockClick',
              clickedItem: itemId,
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function getItemsPopular(callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [0],
          'popular',
          {},
          callback
        );
      }

      function getItemsPopularByBrand(categoryIds, vendor, callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          categoryIds,
          'popular',
          { vendor: vendor },
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

      function getMatchingInfo(recoms) {
        var info = {
          flag: false,
          matchedCategories: [],
        };

        recoms.forEach(function (recom) {
          var categories = recom.CategoryPathsToRoot[0] || [];

          categories.some(function (category) {
            if (needCategories.indexOf(category) > -1 && info.matchedCategories.indexOf(category) == -1) {
              info.matchedCategories.push(category);
              info.flag = true;
            }
          });
        });

        if (info.flag) needRecomTrack = true;

        return info;
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
        var defaultAlgo = widget.getAttribute('data-algorithm'),
          SPalgo = 'SP' + SPvendor,
          SPrecoms = [],
          categoryMatchInfoSearch = JSON.parse(JSON.stringify(getMatchingInfo(recoms))),
          categoryMatchInfoVI = {},
          recomsInfoVI;

        if (categoryMatchInfoSearch.flag) {
          preRenderSP(categoryMatchInfoSearch.matchedCategories, SPrecoms, recoms, SPalgo, defaultAlgo, renderFn);
        } else {
          getItemsPopular(function (itemsPopular) {
            getItemsVCI(function (itemsVCI) {
              recomsInfoVI = checkInterest(itemsPopular, itemsVCI);
              if (recomsInfoVI.hasVI) {
                categoryMatchInfoVI = JSON.parse(JSON.stringify(getMatchingInfo(recomsInfoVI.recoms)));
                if (categoryMatchInfoVI.flag) {
                  preRenderSP(categoryMatchInfoVI.matchedCategories, SPrecoms, recomsInfoVI.recoms, SPalgo, defaultAlgo, renderFn);
                } else {
                  checkRender(SPrecoms, recoms, defaultAlgo, renderFn);
                }
              } else {
                algorithm = defaultAlgo;
                render(recoms, renderFn);
              }
            });
          });
        }
      }

      function preRenderSP(category, SPrecoms, defaultRecoms, SPalgo, defaultAlgo, renderFn) {
        algorithm = SPalgo;

        getItemsPopularByBrand(category, SPvendor, function (popularBrandRecoms) {
          SPrecoms = popularBrandRecoms.slice(0);
          checkRender(SPrecoms, defaultRecoms, defaultAlgo, renderFn);
        });
      }

      function checkRender(SPrecoms, defaultRecoms, defaultAlgo, renderFn) {
        var modRecoms, modSPrecoms;

        if (SPrecoms.length > 2) {
          modSPrecoms = SPrecoms.slice(0, 3);
          modRecoms = modSPrecoms.concat(defaultRecoms);
        } else if (SPrecoms.length > 0 && SPrecoms.length < 3) {
          modRecoms = SPrecoms.concat(defaultRecoms);
        } else {
          algorithm = defaultAlgo;
          modRecoms = defaultRecoms.slice(0);
        }

        render(modRecoms, renderFn);
      }

      function render(recoms, renderFn) {
        if (recoms.length > 2) {
          setStatisticsRender(recoms);
          renderFn(recoms);
        }
      }

      function postRenderFn(widget) {
        var products = widget.querySelectorAll('.rr-item');
        var isShow = false;
        var recoms = [];

        var rrSwiperCarousel = new SwiperModel({
          widget: widget,
          settingSwiper: {
            wrapperClass: 'rr-swiper-wrapper',
            slideClass: 'rr-swiper-slide',
            init: false,
            updateOnWindowResize: true,
            watchOverflow: true,
            observer: true,
            spaceBetween: 0,
            lazy: true,
            preloadImages: true,
            touchReleaseOnEdges: true,
            watchSlidesVisibility: true,
            loop: true,
            navigation: {
              prevEl: widget.querySelector('.swiper-prev'),
              nextEl: widget.querySelector('.swiper-next'),
            },
            pagination: {
              el: widget.querySelector('.rr-slider-dots'),
              type: 'bullets',
              clickable: true,
            },
            autoplay: false,
            speed: 800,
            breakpoints: {
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              500: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
              },
            },
          },
        });
        rrSwiperCarousel.getScript();

        products.forEach(function (item) {
          var product = {
            ItemId: item.getAttribute('data-id'),
          };

          recoms.push(product);
        });

        window.addEventListener('scroll', function () {
          if (!isShow) {
            var widgetScrollTop = widget.getBoundingClientRect()['top'];

            if (widgetScrollTop < 150) {
              setStatisticsShow(recoms);
              isShow = true;
            }
          }
        });
      }

      return {
        postRenderFn: postRenderFn,
        preRenderFn: preRenderFn,
        setStatisticsClick: setStatisticsClick,
      };
    })();

    waitFor(
      function () {
        return 'ga' in window && 'getAll' in window.ga;
      },
      function () {
        var trackerName = ga.getAll()[0].get('name');

        ga(
          trackerName + '.send',
          'event',
          'RRBlock',
          '', // <SegmentId>
          '{{data-retailrocket-markup-block}}',
          {
            nonInteraction: 1,
          }
        );
      }
    );

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="emptySearch"></a> Пустой поиск

### Техническое задание

Запрашиваем выдачу VI и повторяем логику как на главной.

- Если товары Oral-B есть, но их меньше 3, добиваем базовой выдачей блока до 3 товаров.

# <a name="emptySearchPageTemplate"></a> Шаблон для пустого поиска

```html
<style type="text/css">
.rr-widget[data-s="{{data-retailrocket-markup-block}}"]{height:0;visibility:hidden;overflow:hidden;position:relative;display:block;width:100%;font-family:inherit;box-sizing:border-box}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"].rr-active{height:auto;visibility:visible;overflow:visible;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] *{outline:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-widget__title{font-size:18px;font-weight:700;color:#023f5d;text-align:left;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-items{position:relative;overflow:hidden;padding:0;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image{width:100%;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__image img{width:auto;height:auto;max-width:100%;max-height:100%;vertical-align:middle;margin:0 auto;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-wrapper{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-box-sizing:content-box;box-sizing:content-box;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-swiper-slide{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;height:auto;position:relative;-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform;transition-property:transform,-webkit-transform;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item{padding:0 5px;text-align:center;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader{background:#fff;width:100%;height:100%;position:absolute;top:0;left:0;z-index:9;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-lazy-preloader:after{display:block;content:'';background-image:url('https://rrstatic.retailrocket.net/widget/img/swiper_preloader.svg');background-position:50%;background-size:100%;background-repeat:no-repeat;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-ms-transform-origin:50%;transform-origin:50%;background-repeat:no-repeat;-webkit-animation:swiper-preloader-spin 1s steps(50, end) infinite;animation:swiper-preloader-spin 1s steps(50, end) infinite;}
@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__info{text-decoration:none;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title{display:inline-block;font-size:16px;font-weight:400;line-height:20px;color:#043e5e;height:40px;overflow:hidden;outline:none}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__title:hover{text-decoration:none;color:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__old-price{font-size:16px;font-weight:400;color:#023f5d;text-decoration:line-through;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price{font-size:16px;font-weight:400;color:#19addd;display:inline-block}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__price-currency::before{content:'₽ €'}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more{display:block;width:50%;padding:0 15px;background:#023f5d;color:#fff;font-size:14px;font-weight:400;line-height:35px;-webkit-border-radius:5px 0 0 5px;-moz-border-radius:5px 0 0 5px;border-radius:5px 0 0 5px;text-align:center;text-decoration:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-more:hover{text-decoration:none;background:#00528b;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy{font-size:14px;font-weight:400;line-height:35px;color:#fff;background-color:#19addd;padding:0 15px;text-align: center;display:block;text-decoration: none;-webkit-border-radius:0 5px 5px 0;-moz-border-radius:0 5px 5px 0;border-radius:0 5px 5px 0;width:50%;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-item__actions .rr-item__actions-buy:hover{background-color:#2bc4f7}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-arrow{position:absolute;top:50%;-webkit-transform:translate(0, -50%);-moz-transform:translate(0, -50%);-ms-transform:translate(0, -50%);-o-transform:translate(0, -50%);transform:translate(0, -50%);background:url('https://rrstatic.retailrocket.net/widget/img/slider_arrow.svg') no-repeat center center;background-size:contain;width:30px;height:30px;display:block;-webkit-transition:all ease .3s;-moz-transition:all ease .3s;-ms-transition:all ease .3s;-o-transition:all ease .3s;transition:all ease .3s;cursor:pointer;z-index:1;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev{left:0;-webkit-transform:translate(0, -50%) rotate(180deg);-moz-transform:translate(0, -50%) rotate(180deg);-ms-transform:translate(0, -50%) rotate(180deg);-o-transform:translate(0, -50%) rotate(180deg);transform:translate(0, -50%) rotate(180deg);}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-prev:hover,
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next:hover{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-next{right:0;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-arrow .swiper-button-disabled{opacity:0.5;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-button-lock{display:none;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .rr-slider-dots{display:flex;display:-moz-flex;display:-webkit-flex;display:-o-flex;display:-ms-flex;justify-content:center;-webkit-justify-content:center;margin-top:10px;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet{border:solid 1px #19addd;width:12px;height:12px;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;margin:0 2px;cursor:pointer;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullet.swiper-pagination-bullet-active{border-color:#023f5d;background:#023f5d;}
.rr-widget[data-s="{{data-retailrocket-markup-block}}"] .swiper-pagination-bullets.swiper-pagination-lock{display:none;}
</style>

<div
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm="search"
  data-algorithm-argument="{{data-search-phrase}}"
  data-template-param-header-text="retailrocket"
  data-template-param-number-of-items="20"
  data-template-param-item-image-width="320"
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}"
  data-next="rr-widget-{{data-retailrocket-markup-block}}--personal"
></div>

<div
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}--personal"
  data-algorithm="personal"
  data-algorithm-argument="0"
  data-template-param-header-text="retailrocket"
  data-template-param-number-of-items="10"
  data-template-param-item-image-width="320"
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}"
  data-next="rr-widget-{{data-retailrocket-markup-block}}--popular"
></div>

<div
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}--popular"
  data-algorithm="popular"
  data-algorithm-argument="0"
  data-template-param-header-text="retailrocket"
  data-template-param-number-of-items="10"
  data-template-param-item-image-width="320"
  data-template-param-item-image-height="320"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
  data-on-post-render="retailrocket['store{{data-retailrocket-markup-block}}'].postRenderFn(this)"
  data-template-container-id="widget-template-{{data-retailrocket-markup-block}}"
  data-s="{{data-retailrocket-markup-block}}"
></div>

<script id="widget-template-{{data-retailrocket-markup-block}}" type="text/html">
  <div class="rr-widget__title">
    <%=(headerText)%>
  </div>
  <div class="rr-items rr-swiper-container">
    <div class="rr-swiper-wrapper">
      <% for (var i = 0 ; i < numberOfItems; ++i) with(items[i]) { %>
      <div class="rr-swiper-slide">
        <div class="rr-item" data-id="<%=ItemId%>">
          <div class="rr-item__image">
            <a class="rr-item__info" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <img class="swiper-lazy"
                data-src="https://cdn.retailrocket.net/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=jpg&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both">
              <div class="swiper-lazy-preloader"></div>
            </a>
          </div>
          <div class="rr-item__name-block">
            <a class="rr-item__info rr-item__title" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>
              <% if (Name.length > 26) { %>
              <%=Name.substr(0,26)+('...') %>
              <% } else { %>
              <%=Name %>
              <% } %>
            </a>
          </div>
          <div class="rr-item__block-price">
            <% if (OldPrice > Price) { %>
            <div class="rr-item__old-price"> <span
                class="rr-item__old-price-value"><%= retailrocket.widget.formatNumber(OldPrice, '.', ' ', 0) %></span>
              <span class="rr-item__price-currency"></span> </div>
            <% } %>
            <div class="rr-item__price"> <span
                class="rr-item__price-value"><%= retailrocket.widget.formatNumber(Price, '.', ' ', 0) %></span> <span
                class="rr-item__price-currency"></span> </div>
          </div>
          <div class="rr-item__actions">
            <a class="rr-item__actions-more" href="<%=Url%>"
              onmousedown='rrApi.recomMouseDown(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });retailrocket["store{{data-retailrocket-markup-block}}"].setStatisticsClick(<%=ItemId%>);'>Подробнее</a>
            <a class="rr-item__actions-buy" href="<%=Url%>"
              onclick='rrApi.recomAddToCart(<%=ItemId%>, { suggester: "<%=suggesterId%>", methodName: "<%=algorithm%>" });'>Купить</a>
          </div>
        </div>
      </div>
      <% } %>
    </div>
  </div>

  <div class="rr-slider-arrow">
    <a class="rr-arrow swiper-prev"></a>
    <div class="rr-slider-dots"></div>
    <a class="rr-arrow swiper-next"></a>
  </div>
</script>

<script type="text/javascript">
  /**
   * algorithm {String} - переменная, которая содержит название алгоритма, который ренедрится на странице
   * defaultAlgo {String} - переменная, которая содержит базовый алгоритм маркап-блока
   * SegmentID {String} - id сегмента для которого проводится АБ тестирование
   * setStatisticsRender {Function} - отправка события показа (отправлен markuprendered) блока с одним из алгоритмов
   * setStatisticsShow {Function} - отправа события просмотра (отправлен markuviewed) блока с одним из алгоритмов
   * setStatisticsClick {Function} - отправка события клика по товару в блоке (там же, где и onMouseDown)
   * ga {Function} - функия отправки события в Google Analitics независимо от рендера блока
   */

  (function (retailrocket) {
    'use strict';

    var waitFor = function (exitCondition, callback, force) {
      var checkCount = 100;
      var timeout = 1000;

      (function check() {
        var result = exitCondition();
        if (result) {
          callback(result);
          return;
        }

        if (checkCount === 0) {
          if (force) {
            callback();
          }
          return;
        }

        checkCount -= 1;
        setTimeout(check, timeout);
      })();
    };

    var SwiperModel = function (setting) {
      var $widget = setting.widget;
      var swiperSeector = '.rr-swiper-container';
      var source = 'https://rrstatic.retailrocket.net/widget/plugins/rrswiper/rrswiper.min.js';
      var itemsCount = $widget.getAttribute('data-number-of-rendered-items');

      function checkloop(paramsSlider) {
        var modSetting = paramsSlider;

        if (modSetting.loop == true) {
          for (var point in modSetting.breakpoints) {
            if (itemsCount <= modSetting.breakpoints[point].slidesPerView) {
              modSetting.breakpoints[point].loop = false;
            } else {
              modSetting.breakpoints[point].loop = true;
            }
          }
        }

        return modSetting;
      }

      function render(swiperLibrary) {
        var SwiperParams = checkloop(setting.settingSwiper);
        var $rrContainer = $widget.querySelector(swiperSeector);
        var rrSwiper = swiperLibrary == 'RRSwiper' ? new RRSwiper($rrContainer, SwiperParams) : new Swiper($rrContainer, SwiperParams);

        rrSwiper
          .on('init', function () {
            var $imgError = $widget.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate) img');
            var counter = 0;
            var indexImg = [];

            $imgError.forEach(function (img) {
              img.onerror = function () {
                var $slideItem = img.closest('.rr-swiper-slide');
                var $slideSiblings = $slideItem.parentNode.querySelectorAll('.rr-swiper-slide:not(.swiper-slide-duplicate)');
                indexImg.push($slideItem.getAttribute('data-swiper-slide-index'));

                if ($imgError.length == counter) {
                  rrSwiper.removeSlide(indexImg);
                }
              };
              counter++;
            });
            $widget.classList.add('rr-active');
          })
          .on('observerUpdate', function () {
            rrSwiper.resize.resizeHandler();
          });
        rrSwiper.init();
      }

      function getScript() {
        var swiperJs = document.createElement('script');
        var getElemScript = document.getElementsByTagName('script')[0];
        swiperJs.async = 1;

        if (!window.Swiper && !window.RRSwiper) {
          swiperJs.onload = swiperJs.onreadystatechange = function (_,isAbort) {
            if (isAbort || !swiperJs.readyState || /loaded|complete/.test(swiperJs.readyState)) {
              swiperJs.onload = swiperJs.onreadystatechange = null;
              swiperJs = undefined;

              if (!isAbort) setTimeout(render('RRSwiper'), 0);
            }
          };

          swiperJs.src = source;
          getElemScript.parentNode.insertBefore(swiperJs, getElemScript);
        } else {
          var versionSwiper = window.hasOwnProperty('RRSwiper') ? 'RRSwiper' : 'Swiper';
          render(versionSwiper);
        }
      }

      this.getScript = getScript;
    };

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var algorithm = '',
        SPvendor = 'Oral-B',
        needRecomTrack = false,
        needCategories = [ 15140, 971984, 12417, 12659, 1758738, 1759956, 198746, 12660, 13195, 13372, 13382, 1340058, 13379, 13385, 13383, 1252587, 13378, 13386, 13376, 1166795, 1166793, 1239360, 12382, 14772, 14773, 14770, 20712, 2071001, 20706, 2463684633815360, 20705, 3010305, 301030502, 301030503, 301030501, 301030504, 70602, 7060209, 7060204, 7060206, 7060202, 7060201, 7060205, 7060210, 7060208, 2463684633845508, 2463684633845505];

      function getProductsId(products) {
        return products.map(function (product) {
          return product.ItemId;
        });
      }

      function setStatisticsRender(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockRender',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsShow(items) {
        if (needRecomTrack) {
          var recomIds = getProductsId(items);

          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 
              0, 
              [recomIds], {
              eventType: 'blockView',
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function setStatisticsClick(itemId) {
        if (needRecomTrack) {
          rrApiOnReady.push(function () {
            rrApi.recomTrack('{{data-retailrocket-markup-block}}', 0, [], {
              eventType: 'blockClick',
              clickedItem: itemId,
              abtest: '',
              algorithm: algorithm,
            });
          });
        }
      }

      function getItemsPopular(callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [0],
          'popular',
          {},
          callback
        );
      }

      function getItemsPopularByBrand(categoryIds, vendor, callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          categoryIds,
          'popular',
          { vendor: vendor },
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

      function getMatchingInfo(recoms) {
        var info = {
          flag: false,
          matchedCategories: [],
        };

        recoms.forEach(function (recom) {
          var categories = recom.CategoryPathsToRoot[0] || [];

          categories.some(function (category) {
            if (needCategories.indexOf(category) > -1 && info.matchedCategories.indexOf(category) == -1) {
              info.matchedCategories.push(category);
              info.flag = true;
            }
          });
        });

        if (info.flag) needRecomTrack = true;

        return info;
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
        var modRecoms = [];

        if (recoms.length > 4 && recoms.length < 10) {
          modRecoms = recoms.slice(0, 5);
        } else {
          modRecoms = recoms.slice(0);
        }

        checkRender(modRecoms, widget, renderFn);
      }

      function preRenderSP(widget, recoms, renderFn) {
        var defaultRecoms = recoms.slice(0),
          recomsInfo,
          defaultAlgo = widget.getAttribute('data-algorithm'),
          SPalgo = 'SP' + SPvendor,
          categoryMatchInfoVI = {},
          SPrecoms = [];

        getItemsPopular(function (itemsPopular) {
          getItemsVCI(function (itemsVCI) {
            recomsInfo = checkInterest(itemsPopular, itemsVCI);
            if (recomsInfo.hasVI) {
              algorithm = SPalgo;

              categoryMatchInfoVI = JSON.parse(JSON.stringify(getMatchingInfo(recomsInfo.recoms)));
            } else {
              algorithm = defaultAlgo;
            }

            if (categoryMatchInfoVI.flag) {
              getItemsPopularByBrand(categoryMatchInfoVI.matchedCategories, SPvendor, function (popularItemsSP) {
                  SPrecoms = popularItemsSP.slice(0);
                  checkRenderSP(SPrecoms, defaultRecoms, defaultAlgo, renderFn);
                }
              );
            } else {
              checkRenderSP(SPrecoms, defaultRecoms, defaultAlgo, renderFn);
            }
          });
        });
      }

      function checkRender(recoms, widget, renderFn) {
        if (recoms.length > 4) {
          preRenderSP(widget, recoms, renderFn);
        } else if (widget.getAttribute('data-algorithm') == 'popular') {
          preRenderSP(widget, recoms, renderFn);
        } else {
          retailrocket.widget.render(widget.getAttribute('data-next'));
        }
      }

      function checkRenderSP(SPrecoms, defaultRecoms, defaultAlgo, renderFn) {
        var modRecoms, modSPrecoms;

        if (SPrecoms.length > 4) {
          modSPrecoms = SPrecoms.slice(0, 5);
          modRecoms = SPrecoms.concat(defaultRecoms);
        } else if (SPrecoms.length > 0 && SPrecoms.length < 5) {
          modRecoms = SPrecoms.concat(defaultRecoms);
        } else {
          algorithm = defaultAlgo;
          modRecoms = defaultRecoms.slice(0);
        }

        render(modRecoms, renderFn);
      }

      function render(recoms, renderFn) {
        if (recoms.length > 4) {
          setStatisticsRender(recoms);
          renderFn(recoms);
        }
      }

      function postRenderFn(widget) {
        var products = widget.querySelectorAll('.rr-item');
        var isShow = false;
        var recoms = [];

        var rrSwiperCarousel = new SwiperModel({
          widget: widget,
          settingSwiper: {
            wrapperClass: 'rr-swiper-wrapper',
            slideClass: 'rr-swiper-slide',
            init: false,
            updateOnWindowResize: true,
            watchOverflow: true,
            observer: true,
            spaceBetween: 0,
            lazy: true,
            preloadImages: true,
            touchReleaseOnEdges: true,
            watchSlidesVisibility: true,
            loop: true,
            navigation: {
              prevEl: widget.querySelector('.swiper-prev'),
              nextEl: widget.querySelector('.swiper-next'),
            },
            pagination: {
              el: widget.querySelector('.rr-slider-dots'),
              type: 'bullets',
              clickable: true,
            },
            autoplay: false,
            speed: 800,
            breakpoints: {
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              500: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
              },
            },
          },
        });
        rrSwiperCarousel.getScript();

        products.forEach(function (item) {
          var product = {
            ItemId: item.getAttribute('data-id'),
          };

          recoms.push(product);
        });

        window.addEventListener('scroll', function () {
          if (!isShow) {
            var widgetScrollTop = widget.getBoundingClientRect()['top'];

            if (widgetScrollTop < 150) {
              setStatisticsShow(recoms);
              isShow = true;
            }
          }
        });
      }

      return {
        postRenderFn: postRenderFn,
        preRenderFn: preRenderFn,
        setStatisticsClick: setStatisticsClick,
      };
    })();

    waitFor(
      function () {
        return 'ga' in window && 'getAll' in window.ga;
      },
      function () {
        var trackerName = ga.getAll()[0].get('name');

        ga(
          trackerName + '.send',
          'event',
          'RRBlock',
          '', // <SegmentId>
          '{{data-retailrocket-markup-block}}',
          {
            nonInteraction: 1,
          }
        );
      }
    );

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="finalStage"></a> Вывод блоков SP в бой

# <a name="finalStageInfo"></a> Общие сведения

**Для реализации данной стадии нам потребуется**

1. Родительский маркап блок (для будущей вложенности)
2. Дочерний(е) маркап блок(и) с подоготовленной логикой SP, которая прошла проверку и готова к выводу в бой
3. Созданные сегменты АБ тестирования
4. Информация о брендахи их приоритности

<span style="color:red">Внимание!</span>

***Проверка интереса и таргетинга в родительском блоке может отличаться от страницы, на которой он находится, но мы можем отталкиваться от логики проверки в дочерних блоках SP и повторять её. Для того чтобы посмотреть рахные примеры, перейдите [сюда](#cases)***

# <a name="renderOneBlock"></a> Рендер SP блока с одним брендом

**Если мы работаем с одни брендом, то можно обойтись без приоритетности и проверки интересов, и сразу отрендерить нужный блок**

Код примера (Добавляется в родительский/исходный маркап блок) :

```html
<script type="text/javascript">
  (function (retailrocket) {
    'use strict';

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var SP = {
        pampers: {
          markUpId: '5eea049897a5252aa898be6a', // ID дочернего маркап блока с логикой SP
        },
      };

      createDOMelement(SP.pampers.markUpId);

      function createDOMelement(id) {
        var container = document.createElement('div');

        container.setAttribute('data-retailrocket-markup-block', id);
        document
          .querySelector(
            '[data-retailrocket-markup-block="{{data-retailrocket-markup-block}}"]'
          )
          .prepend(container);
        retailrocket.markup.render();
      }
    })();

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="renderWithPriorities"></a> Рендер SP блоков по приоритетам

**Для реализации рендера блоков по приоритема нужны четкие интсрукции о том, какой бренд является приоритетным и будет является блоком по умолчанию (в случае отстуствия интересов и таргетинга)**

Например, рассмотрим задачу с двумя брендами (Pampers и Oral-B) где брендом по умолчанию является Oral-B

Код примера (Добавляется в родительский/исходный маркап блок) :

```html
<div
  style="display:none!important;"
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm-type="visitor-category-interest"
  data-algorithm="popular"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
></div>

<script type="text/javascript">
  (function (retailrocket) {
    'use strict';

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var oralBcategories = [ 1598807265, 662115644, 330352666, 621562182, 1224185396, 665663373, 1983819148, 1672057217, 1876177588, 262162971, 1019417563, 228652969, 1638123149, 1887053984, 1051350026, 45959523, 1150600776, 760895856, 1639995091, 243006333, 37930607, 711909997, 720764012, 1330583672, 2000210481, 716276987, 2061962300, 1968467606, 1566897461],
        SP = {
          orlaB: {
            markUpId: '5eea053397a5252aa898be6f',
          },
          pampers: {
            markUpId: '5eea049897a5252aa898be6a',
          },
        };

      function getItemsPopular(callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [0],
          'popular',
          {},
          callback
        );
      }

      function checkSomeCategoryMatch(recoms, categories) {
        return recoms.some(function (recom) {
          return recom.CategoryPathsToRoot[0].some(function (root) {
            return categories.indexOf(root) != -1;
          });
        });
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

      function preRenderFn(widget, recomsVI, renderFn) {
        var newRecoms;

        getItemsPopular(function (popularItems) {
          var needOral;

          newRecoms = checkInterest(popularItems, recomsVI);

          if (newRecoms.hasVI) {
            needOral = checkSomeCategoryMatch(newRecoms, oralBcategories);

            if (needOral) {
              createDOMelement(SP.orlaB.markUpId, widget);
            } else {
              createDOMelement(SP.pampers.markUpId, widget);
            }
          } else {
            createDOMelement(SP.orlaB.markUpId, widget);
          }
        });
      }

      function createDOMelement(id, widget) {
        var blockId = id || SP.orlaB.markUpId;

        var container = document.createElement('div');
        container.setAttribute('data-retailrocket-markup-block', blockId);
        widget
          .closest(
            '[data-retailrocket-markup-block="{{data-retailrocket-markup-block}}"]'
          )
          .prepend(container);
        retailrocket.markup.render();
      }

      return {
        preRenderFn: preRenderFn,
      };
    })();

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="renderWithSegmentator"></a> Рендер SP блоков с использованием сегментатора

# <a name="renderHomeSegmentator"></a> Главная страница

##### Код примера (Добавляется в родительский/исходный маркап блок) :

```html
<div style="display:none!important"
     class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
     data-algorithm-type="visitor-category-interest"
     data-algorithm="popular"
     data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)">
</div>

<script type="text/javascript">
  (function (retailrocket) {
    'use strict';

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var SP = {
        hair: {
          markUpId: '5f3f716497a5251370323912',
          categories: [13213,13176,13237,13177,16233,13184,13202,13284,13204,1626818,13203,13283,1639432,1639433,13282,1639436,1639434,1639435,1626817,1623644,13250,13255,13289,13290,361085,13253,13251,348520,348521,13254,348522,348110,13291,70404,7040401,7040402,7040405,70403,7040301,7040304,2463684633802333,7040303,70402,7040202,7040201,7040203,7040206,70401,7040108,7040102,7040103,2463684633818313,7040104,7040106,2463684633818123,2463684633818124,7040105,7040107,2463684633818129,2463684633818116,7040101,1991851936,2030377012,621678729]
        },
        pampers: {
          markUpId: '5f33ee4a97a5283430a874bc',
          categories: [12540,14729,14728,14730,14742,14731,14732,14733,14717,14715,12079,14734,14735,12544,14780,14775,14705,14704,1257654,1257653,12685,15582,12545,12687,12688,15578,15579,12686,15580,12690,15581,12689,12442,1479253,12444,12382,14773,14770,3010102,301030602,301030601,301010202,301010201,2463684633846659,2463684633846658,301,2463684633781905,3050101,3050103,3050104,2463684633781901,2463684633781902,3050102,2463684633781903,3010101,2463684633781904,3050105,2463684633781362,2463684633781368,2463684633781397,2463684633781399,2463684633814459,2463684633781400,2463684633781365,2463684633781366,2463684633781390,2463684633781391,2463684633781389,2463684633781395,2463684633781394,2463684633781392,2463684633781393,2463684633781363,2463684633781374,2463684633781375,2463684633781376,2463684633790901,2463684633781384,2463684633781364,2463684633781381,2463684633781379,2463684633781382,2463684633781380,12017,12543,14709,14707,14713,14712,14718,14716,14719,12018,12019,12135,12133,12128,12132,12130,12131,12137,12065,12066,500905,500907,14755,500909,502199,500910,502200,500906,500908,12072,14753,14752,14751,12067,12078,14739,14736,14741,14738,14740,14737,12074,14746,14745,14748,14744,14747,12076,12069,14750,14749,12376,12377,12391,12389,14761,14764,14763,12378,12387,14767,14766,12541,14711,14710,12423,1479259,1479263,1479260,1479262,12438,12440,15378,15384,15409,15411,157327,15412,15381,15382,15402,15403,15401,15407,15406,15404,15405,15379,15390,15391,15392,15767,15398,15380,15395,15393,15396,15394,12369,15959,16084,16086,16088,16062,16087,16063,16057,15960,16085]
        }
      };

      if (!('SPtest' in retailrocket.modules)) {
        retailrocket.setModule('SPtest', [], function () {
          var needVendor = '';
          var identifierSegment = +retailrocket.segmentator.getVisitorSegment(Object.entries(SP).length);

          function getNeedVendor() {
            needVendor = Object.entries(SP)[identifierSegment - 1][0];
          }

          function checkCategoryMatch(productRecoms) {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              productRecoms.some(function(prodRecom){
                return prodRecom.CategoryPathsToRoot.some(function(catPathToRoot){
                  return catPathToRoot.some(function(catId){
                    Object.values(SP).some(function(markup) {
                      if (markup.categories.indexOf(catId) > -1) {
                        needMarkupId = markup.markUpId;
                      }
                    });
                  });
                });
              });

              getNeedVendor();
            }

            return needMarkupId;
          }

          function setSegmentForClient() {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              needMarkupId = Object.entries(SP)[identifierSegment - 1][1].markUpId;
              getNeedVendor();
            }

            return needMarkupId;
          }

          return {
            setSegmentForClient: setSegmentForClient,
            checkCategoryMatch: checkCategoryMatch
          }
        });
      }

      if (!("duplicatesMain" in retailrocket.modules)) {
        retailrocket.setModule("duplicatesMain", [], function () {
          var savedIds = [];
          var paramName = "ItemId";

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

      function getItemsPopular(callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [0],
          "popular",
          {},
          callback
        );
      }

      function preRenderFn(widget, recoms, renderFn) {
        var blockId;

        getItemsPopular(function (itemsPopular) {
          var popularRecoms = itemsPopular.filter(retailrocket.modules.duplicatesMain.filter);
          var VCIrecoms = recoms.filter(retailrocket.modules.duplicatesMain.filter);
          var blockId = false;

          if (VCIrecoms.length > 0) {
            blockId = retailrocket.modules.SPtest.checkCategoryMatch(recoms);
          }

          if (!blockId) {
            blockId = retailrocket.modules.SPtest.setSegmentForClient();
          }

          createDOMelement(blockId, widget);
        });
      }

      function createDOMelement(id, widget) {
        var container = document.createElement('div');
        
        container.setAttribute('data-retailrocket-markup-block', id);
        widget.closest('[data-retailrocket-markup-block="{{data-retailrocket-markup-block}}"]').prepend(container);
        retailrocket.markup.render();
      }

      return {
        preRenderFn: preRenderFn,
      };
    })();

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="renderCategorySegmentator"></a> Категория

##### Код примера (Добавляется в родительский/исходный маркап блок) :

```html
<script type="text/javascript">
  (function (retailrocket) {
    'use strict';

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var SP = {
        hair: {
          markUpId: '5f3f71f897a52844fc760972',
          categories: [13175,13213,13176,13237,13177,16233,13184,13202,13284,13204,1626818,13203,13283,1639432,1639433,13282,1639436,1639434,1639435,1626817,1623644,13250,13255,13289,13290,361085,13253,13251,348520,348521,13254,348522,348110,13291,70404,7040401,7040402,7040405,70403,7040301,7040304,2463684633802333,7040303,70402,7040202,7040201,7040203,7040206,70401,7040108,7040102,7040103,2463684633818313,7040104,7040106,2463684633818123,2463684633818124,7040105,7040107,2463684633818129,2463684633818116,7040101,1991851936,2030377012,621678729]
        },
        pampers: {
          markUpId: '5f33eee597a52518884230fc',
          categories: [12540,14729,14728,14730,14742,14731,14732,14733,14717,14715,12079,14734,14735,12544,14780,14775,14705,14704,1257654,1257653,12685,15582,12545,12687,12688,15578,15579,12686,15580,12690,15581,12689,12442,1479253,12444,12382,14773,14770,3010102,301030602,301030601,301010202,301010201,2463684633846659,2463684633846658,301,2463684633781905,3050101,3050103,3050104,2463684633781901,2463684633781902,3050102,2463684633781903,3010101,2463684633781904,3050105,2463684633781362,2463684633781368,2463684633781397,2463684633781399,2463684633814459,2463684633781400,2463684633781365,2463684633781366,2463684633781390,2463684633781391,2463684633781389,2463684633781395,2463684633781394,2463684633781392,2463684633781393,2463684633781363,2463684633781374,2463684633781375,2463684633781376,2463684633790901,2463684633781384,2463684633781364,2463684633781381,2463684633781379,2463684633781382,2463684633781380,12017,12543,14709,14707,14713,14712,14718,14716,14719,12018,12019,12135,12133,12128,12132,12130,12131,12137,12065,12066,500905,500907,14755,500909,502199,500910,502200,500906,500908,12072,14753,14752,14751,12067,12078,14739,14736,14741,14738,14740,14737,12074,14746,14745,14748,14744,14747,12076,12069,14750,14749,12376,12377,12391,12389,14761,14764,14763,12378,12387,14767,14766,12541,14711,14710,12423,1479259,1479263,1479260,1479262,12438,12440,15378,15384,15409,15411,157327,15412,15381,15382,15402,15403,15401,15407,15406,15404,15405,15379,15390,15391,15392,15767,15398,15380,15395,15393,15396,15394,12369,15959,16084,16086,16088,16062,16087,16063,16057,15960,16085]
        }
      },
          pageCategory = +'{{data-category-id}}',
          mainContainer = document.querySelector('[data-retailrocket-markup-block="{{data-retailrocket-markup-block}}"]');

      if (!('SPtest' in retailrocket.modules)) {
        retailrocket.setModule('SPtest', [], function () {
          var needVendor = '';
          var identifierSegment = +retailrocket.segmentator.getVisitorSegment(Object.entries(SP).length);

          function getNeedVendor() {
            needVendor = Object.entries(SP)[identifierSegment - 1][0];
          }

          function checkCategoryMatch() {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              Object.values(SP).some(function(markup) {
                if (markup.categories.indexOf(pageCategory) > -1) {
                  needMarkupId = markup.markUpId;
                }
              });

              getNeedVendor();
            }

            return needMarkupId;
          }

          function setSegmentForClient() {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              needMarkupId = Object.entries(SP)[identifierSegment - 1][1].markUpId;
              getNeedVendor();
            }

            return needMarkupId;
          }

          return {
            setSegmentForClient: setSegmentForClient,
            checkCategoryMatch: checkCategoryMatch
          }
        });
      }

      (function render() {
        var blockId = retailrocket.modules.SPtest.checkCategoryMatch();

        if (!blockId) {
          blockId = retailrocket.modules.SPtest.setSegmentForClient();
        }

        createDOMelement(blockId);
      }());

      function createDOMelement(id) {
        var blockId = id;
        var container = document.createElement('div');

        container.setAttribute('data-retailrocket-markup-block', blockId);
        container.setAttribute('data-category-id', '{{data-category-id}}');
        mainContainer.prepend(container);
        retailrocket.markup.render();
      }
    })();
  })(retailrocket);
</script>
```

# <a name="renderCardSegmentator"></a> Карточка товара

##### Код примера (Добавляется в родительский/исходный маркап блок) :

```html
<script type="text/javascript">
  (function (retailrocket) {
    'use strict';

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var SP = {
        hair: {
          markUpId: '5f3f71a497a5251370323916',
          categories: [13213,13176,13237,13177,16233,13184,13202,13284,13204,1626818,13203,13283,1639432,1639433,13282,1639436,1639434,1639435,1626817,1623644,13250,13255,13289,13290,361085,13253,13251,348520,348521,13254,348522,348110,13291,70404,7040401,7040402,7040405,70403,7040301,7040304,2463684633802333,7040303,70402,7040202,7040201,7040203,7040206,70401,7040108,7040102,7040103,2463684633818313,7040104,7040106,2463684633818123,2463684633818124,7040105,7040107,2463684633818129,2463684633818116,7040101,1991851936,2030377012,621678729]
        },
        pampers: {
          markUpId: '5f33ee6397a5283430a874c1',
          categories: [12540, 14729, 14728, 14730, 14742, 14731, 14732, 14733, 14717, 14715, 12079, 14734, 14735, 12544, 14780, 14775, 14705, 14704, 1257654, 1257653, 12685, 15582, 12545, 12687, 12688, 15578, 15579, 12686, 15580, 12690, 15581, 12689, 12442, 1479253, 12444, 12382, 14773, 14770, 3010102, 301030602, 301030601, 301010202, 301010201, 2463684633846659, 2463684633846658, 301, 2463684633781905, 3050101, 3050103, 3050104, 2463684633781901, 2463684633781902, 3050102, 2463684633781903, 3010101, 2463684633781904, 3050105, 2463684633781362, 2463684633781368, 2463684633781397, 2463684633781399, 2463684633814459, 2463684633781400, 2463684633781365, 2463684633781366, 2463684633781390, 2463684633781391, 2463684633781389, 2463684633781395, 2463684633781394, 2463684633781392, 2463684633781393, 2463684633781363, 2463684633781374, 2463684633781375, 2463684633781376, 2463684633790901, 2463684633781384, 2463684633781364, 2463684633781381, 2463684633781379, 2463684633781382, 2463684633781380, 12017, 12543, 14709, 14707, 14713, 14712, 14718, 14716, 14719, 12018, 12019, 12135, 12133, 12128, 12132, 12130, 12131, 12137, 12065, 12066, 500905, 500907, 14755, 500909, 502199, 500910, 502200, 500906, 500908, 12072, 14753, 14752, 14751, 12067, 12078, 14739, 14736, 14741, 14738, 14740, 14737, 12074, 14746, 14745, 14748, 14744, 14747, 12076, 12069, 14750, 14749, 12376, 12377, 12391, 12389, 14761, 14764, 14763, 12378, 12387, 14767, 14766, 12541, 14711, 14710, 12423, 1479259, 1479263, 1479260, 1479262, 12438, 12440, 15378, 15384, 15409, 15411, 157327, 15412, 15381, 15382, 15402, 15403, 15401, 15407, 15406, 15404, 15405, 15379, 15390, 15391, 15392, 15767, 15398, 15380, 15395, 15393, 15396, 15394, 12369, 15959, 16084, 16086, 16088, 16062, 16087, 16063, 16057, 15960, 16085]
        }
      };
      var widget = document.querySelector('[data-retailrocket-markup-block="{{data-retailrocket-markup-block}}"]');

      if (!('SPtest' in retailrocket.modules)) {
        retailrocket.setModule('SPtest', [], function () {
          var needVendor = '';
          var identifierSegment = +retailrocket.segmentator.getVisitorSegment(Object.entries(SP).length);

          function getNeedVendor() {
            needVendor = Object.entries(SP)[identifierSegment - 1][0];
          }

          function checkCategoryMatch(productCategoryId) {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              Object.values(SP).some(function(markup) {
                if (markup.categories.indexOf(productCategoryId) > -1) {
                  needMarkupId = markup.markUpId;
                }
              });

              getNeedVendor();
            }

            return needMarkupId;
          }

          function setSegmentForClient() {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              needMarkupId = Object.entries(SP)[identifierSegment - 1][1].markUpId;
              getNeedVendor();
            }

            return needMarkupId;
          }

          return {
            setSegmentForClient: setSegmentForClient,
            checkCategoryMatch: checkCategoryMatch
          }
        });
      }

      function getItems(requireProducts, callback) {
        retailrocket.items.get(
          retailrocket.api.getPartnerId(),
          requireProducts,
          callback
        );
      }

      (function () {
        var productList = widget.getAttribute('data-product-id').split(',');

        getItems(productList, function(currentProducts) {
          var pageProductCategoryId = currentProducts[0].CategoryIds[0];
          var blockId = retailrocket.modules.SPtest.checkCategoryMatch(pageProductCategoryId);

          if (!blockId) {
            blockId = retailrocket.modules.SPtest.setSegmentForClient();
          }

          createDOMelement(blockId);
        });
      }());

      function createDOMelement(id) {
        var blockId = id;
        var container = document.createElement('div');

        container.setAttribute('data-retailrocket-markup-block', blockId);
        container.setAttribute('data-product-id', '{{data-product-id}}');
        widget.prepend(container);
        retailrocket.markup.render();
      }
    })();
  })(retailrocket);
</script>
```

# <a name="renderSearchSegmentator"></a> Поиск

##### Код примера (Добавляется в родительский/исходный маркап блок) :

```html
<div
  style="display: none !important;"
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm="search"
  data-algorithm-argument="{{data-search-phrase}}"
  data-algorithm-param-version="9"
  data-algorithm-param-features="/PropertyInterests"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
></div>

<script type="text/javascript">
  (function (retailrocket) {
    'use strict';

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var SP = {
        hair: {
          markUpId: '5f3f71b997a5251370323917',
          categories: [13213,13176,13237,13177,16233,13184,13202,13284,13204,1626818,13203,13283,1639432,1639433,13282,1639436,1639434,1639435,1626817,1623644,13250,13255,13289,13290,361085,13253,13251,348520,348521,13254,348522,348110,13291,70404,7040401,7040402,7040405,70403,7040301,7040304,2463684633802333,7040303,70402,7040202,7040201,7040203,7040206,70401,7040108,7040102,7040103,2463684633818313,7040104,7040106,2463684633818123,2463684633818124,7040105,7040107,2463684633818129,2463684633818116,7040101,1991851936,2030377012,621678729]
        },
        pampers: {
          markUpId: '5f33ee8097a5283430a874c4',
          categories: [12540, 14729, 14728, 14730, 14742, 14731, 14732, 14733, 14717, 14715, 12079, 14734, 14735, 12544, 14780, 14775, 14705, 14704, 1257654, 1257653, 12685, 15582, 12545, 12687, 12688, 15578, 15579, 12686, 15580, 12690, 15581, 12689, 12442, 1479253, 12444, 12382, 14773, 14770, 3010102, 301030602, 301030601, 301010202, 301010201, 2463684633846659, 2463684633846658, 301, 2463684633781905, 3050101, 3050103, 3050104, 2463684633781901, 2463684633781902, 3050102, 2463684633781903, 3010101, 2463684633781904, 3050105, 2463684633781362, 2463684633781368, 2463684633781397, 2463684633781399, 2463684633814459, 2463684633781400, 2463684633781365, 2463684633781366, 2463684633781390, 2463684633781391, 2463684633781389, 2463684633781395, 2463684633781394, 2463684633781392, 2463684633781393, 2463684633781363, 2463684633781374, 2463684633781375, 2463684633781376, 2463684633790901, 2463684633781384, 2463684633781364, 2463684633781381, 2463684633781379, 2463684633781382, 2463684633781380, 12017, 12543, 14709, 14707, 14713, 14712, 14718, 14716, 14719, 12018, 12019, 12135, 12133, 12128, 12132, 12130, 12131, 12137, 12065, 12066, 500905, 500907, 14755, 500909, 502199, 500910, 502200, 500906, 500908, 12072, 14753, 14752, 14751, 12067, 12078, 14739, 14736, 14741, 14738, 14740, 14737, 12074, 14746, 14745, 14748, 14744, 14747, 12076, 12069, 14750, 14749, 12376, 12377, 12391, 12389, 14761, 14764, 14763, 12378, 12387, 14767, 14766, 12541, 14711, 14710, 12423, 1479259, 1479263, 1479260, 1479262, 12438, 12440, 15378, 15384, 15409, 15411, 157327, 15412, 15381, 15382, 15402, 15403, 15401, 15407, 15406, 15404, 15405, 15379, 15390, 15391, 15392, 15767, 15398, 15380, 15395, 15393, 15396, 15394, 12369, 15959, 16084, 16086, 16088, 16062, 16087, 16063, 16057, 15960, 16085]
        }
      };

      if (!('SPtest' in retailrocket.modules)) {
        retailrocket.setModule('SPtest', [], function () {
          var needVendor = '';
          var identifierSegment = +retailrocket.segmentator.getVisitorSegment(Object.entries(SP).length);

          function getNeedVendor() {
            needVendor = Object.entries(SP)[identifierSegment - 1][0];
          }

          function checkCategoryMatch(recoms) {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              var check = false;

              Object.values(SP).some(function(markup) {
                recoms.some(function(product) {
                  if (markup.categories.indexOf(product.CategoryIds[0]) > -1) {
                    check = true;
                    needMarkupId = markup.markUpId;
                  }

                  return check;
                });
              });

              getNeedVendor();
            }

            return needMarkupId;
          }

          function setSegmentForClient() {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              needMarkupId = Object.entries(SP)[identifierSegment - 1][1].markUpId;
              getNeedVendor();
            }

            return needMarkupId;
          }

          return {
            setSegmentForClient: setSegmentForClient,
            checkCategoryMatch: checkCategoryMatch
          }
        });
      }

      function getItems(requireProducts, callback) {
        retailrocket.items.get(
          retailrocket.api.getPartnerId(),
          requireProducts,
          callback
        );
      }

      function preRenderFn(widget, recoms, renderFn) {
        var blockId = retailrocket.modules.SPtest.checkCategoryMatch(recoms);

        if (!blockId) {
          blockId = retailrocket.modules.SPtest.setSegmentForClient();
        }

        createDOMelement(blockId, widget);
      }

      function createDOMelement(id, widget) {
        var blockId = id;
        var container = document.createElement('div');

        container.setAttribute('data-retailrocket-markup-block', blockId);
        container.setAttribute('data-search-phrase', "{{data-search-phrase}}");
        widget.closest('[data-retailrocket-markup-block="{{data-retailrocket-markup-block}}"]').prepend(container);
        retailrocket.markup.render();
      }

      return {
        preRenderFn: preRenderFn,
      };
    })();

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```

# <a name="renderEmptySearchSegmentator"></a> Пустой поиск

##### Код примера (Добавляется в родительский/исходный маркап блок) :

```html
<div
  style="display: none !important;"
  class="rr-widget rr-widget-{{data-retailrocket-markup-block}}"
  data-algorithm="search"
  data-algorithm-argument="{{data-search-phrase}}"
  data-algorithm-param-version="9"
  data-algorithm-param-features="/PropertyInterests"
  data-on-pre-render="retailrocket['store{{data-retailrocket-markup-block}}'].preRenderFn(this, data, renderFn)"
></div>

<script type="text/javascript">
  (function (retailrocket) {
    'use strict';

    if (!("duplicatesMain" in retailrocket.modules)) {
      retailrocket.setModule("duplicatesMain", [], function () {
        var savedIds = [];
        var paramName = "ItemId";

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

    retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
      var SP = {
        hair: {
          markUpId: '5f3f71ca97a52844fc76096e',
          categories: [13213,13176,13237,13177,16233,13184,13202,13284,13204,1626818,13203,13283,1639432,1639433,13282,1639436,1639434,1639435,1626817,1623644,13250,13255,13289,13290,361085,13253,13251,348520,348521,13254,348522,348110,13291,70404,7040401,7040402,7040405,70403,7040301,7040304,2463684633802333,7040303,70402,7040202,7040201,7040203,7040206,70401,7040108,7040102,7040103,2463684633818313,7040104,7040106,2463684633818123,2463684633818124,7040105,7040107,2463684633818129,2463684633818116,7040101,1991851936,2030377012,621678729]
        },
        pampers: {
          markUpId: '5f33ee9b97a52518884230ef',
          categories: [12540, 14729, 14728, 14730, 14742, 14731, 14732, 14733, 14717, 14715, 12079, 14734, 14735, 12544, 14780, 14775, 14705, 14704, 1257654, 1257653, 12685, 15582, 12545, 12687, 12688, 15578, 15579, 12686, 15580, 12690, 15581, 12689, 12442, 1479253, 12444, 12382, 14773, 14770, 3010102, 301030602, 301030601, 301010202, 301010201, 2463684633846659, 2463684633846658, 301, 2463684633781905, 3050101, 3050103, 3050104, 2463684633781901, 2463684633781902, 3050102, 2463684633781903, 3010101, 2463684633781904, 3050105, 2463684633781362, 2463684633781368, 2463684633781397, 2463684633781399, 2463684633814459, 2463684633781400, 2463684633781365, 2463684633781366, 2463684633781390, 2463684633781391, 2463684633781389, 2463684633781395, 2463684633781394, 2463684633781392, 2463684633781393, 2463684633781363, 2463684633781374, 2463684633781375, 2463684633781376, 2463684633790901, 2463684633781384, 2463684633781364, 2463684633781381, 2463684633781379, 2463684633781382, 2463684633781380, 12017, 12543, 14709, 14707, 14713, 14712, 14718, 14716, 14719, 12018, 12019, 12135, 12133, 12128, 12132, 12130, 12131, 12137, 12065, 12066, 500905, 500907, 14755, 500909, 502199, 500910, 502200, 500906, 500908, 12072, 14753, 14752, 14751, 12067, 12078, 14739, 14736, 14741, 14738, 14740, 14737, 12074, 14746, 14745, 14748, 14744, 14747, 12076, 12069, 14750, 14749, 12376, 12377, 12391, 12389, 14761, 14764, 14763, 12378, 12387, 14767, 14766, 12541, 14711, 14710, 12423, 1479259, 1479263, 1479260, 1479262, 12438, 12440, 15378, 15384, 15409, 15411, 157327, 15412, 15381, 15382, 15402, 15403, 15401, 15407, 15406, 15404, 15405, 15379, 15390, 15391, 15392, 15767, 15398, 15380, 15395, 15393, 15396, 15394, 12369, 15959, 16084, 16086, 16088, 16062, 16087, 16063, 16057, 15960, 16085]
        }
      };

      function getItemsPopular(callback) {
        retailrocket.recommendation.forCategories(
          retailrocket.api.getPartnerId(),
          [0],
          "popular",
          {},
          callback
        );
      }

      function getItemsVCI(callback) {
        retailrocket.recommendation.forVisitorCategoryInterest(
          retailrocket.api.getPartnerId(),
          retailrocket.api.getSessionId(),
          "popular",
          {},
          callback
        );
      }

      if (!('SPtest' in retailrocket.modules)) {
        retailrocket.setModule('SPtest', [], function () {
          var needVendor = '';
          var identifierSegment = +retailrocket.segmentator.getVisitorSegment(Object.entries(SP).length);

          function getNeedVendor() {
            needVendor = Object.entries(SP)[identifierSegment - 1][0];
          }

          function checkCategoryMatch(recoms) {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              var check = false;

              Object.values(SP).some(function(markup) {
                recoms.some(function(product) {
                  if (markup.categories.indexOf(product.CategoryIds[0]) > -1) {
                    check = true;
                    needMarkupId = markup.markUpId;
                  }

                  return check;
                });
              });

              getNeedVendor();
            }

            return needMarkupId;
          }

          function setSegmentForClient() {
            var needMarkupId = false;

            if (needVendor != '') {
              needMarkupId = SP[needVendor].markUpId;
            } else {
              needMarkupId = Object.entries(SP)[identifierSegment - 1][1].markUpId;
              getNeedVendor();
            }

            return needMarkupId;
          }

          return {
            setSegmentForClient: setSegmentForClient,
            checkCategoryMatch: checkCategoryMatch
          }
        });
      }

      function preRenderFn(widget, recoms, renderFn) {
        getItemsPopular(function (itemsPopular) {
          getItemsVCI(function (itemsVCI) {
            var popularRecoms = itemsPopular.filter(retailrocket.modules.duplicatesMain.filter);
            var VCIrecoms = itemsVCI.filter(retailrocket.modules.duplicatesMain.filter);
            var blockId = retailrocket.modules.SPtest.checkCategoryMatch(recoms);

            if (!blockId) {
              if (VCIrecoms.length > 0) blockId = retailrocket.modules.SPtest.checkCategoryMatch(VCIrecoms);
            }

            if (!blockId) blockId = retailrocket.modules.SPtest.setSegmentForClient();

            createDOMelement(blockId, widget);
          });
        });
      }

      function createDOMelement(id, widget) {
        var blockId = id;
        var container = document.createElement('div');

        container.setAttribute('data-retailrocket-markup-block', blockId);
        container.setAttribute('data-search-phrase', "{{data-search-phrase}}");
        widget.closest('[data-retailrocket-markup-block="{{data-retailrocket-markup-block}}"]').prepend(container);
        retailrocket.markup.render();
      }

      return {
        preRenderFn: preRenderFn,
      };
    })();

    retailrocket.widget.render('rr-widget-{{data-retailrocket-markup-block}}');
  })(retailrocket);
</script>
```