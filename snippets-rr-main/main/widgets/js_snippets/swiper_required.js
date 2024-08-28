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
	var source =
		'https://rrstatic.retailrocket.net/widget/plugins/rrswiper/rrswiper.min.js';
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

	function render() {
		var SwiperParams = checkloop(setting.settingSwiper);
		var $rrContainer = $widget.querySelector(swiperSeector);

		waitFor(
			function () {
				return window.require || window.requirejs;
			},
			function () {
				require([source], function (RRSwiper) {
					var rrSwiper = new RRSwiper($rrContainer, SwiperParams);

					rrSwiper
						.on('init', function () {
							var $imgError = $widget.querySelectorAll(
								'.rr-swiper-slide:not(.swiper-slide-duplicate) img'
							);
							var counter = 0;
							var indexImg = [];

							$imgError.forEach(function (img) {
								img.onerror = function () {
									var $slideItem = img.closest('.rr-swiper-slide');
									var $slideSiblings = $slideItem.parentNode.querySelectorAll(
										'.rr-swiper-slide:not(.swiper-slide-duplicate)'
									);
									indexImg.push(
										$slideItem.getAttribute('data-swiper-slide-index')
									);

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
				});
			}
		);
	}

	this.render = render;
};

function postRenderFn(widget) {
	var rrSwiperCarousel = new SwiperModel({
    //you swiper settings
  });
  
	rrSwiperCarousel.render();
}
