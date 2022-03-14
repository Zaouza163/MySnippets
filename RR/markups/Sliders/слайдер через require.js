require([
	'https://rrstatic.retailrocket.net/widget/plugins/swiper/3.4.2/js/swiper.min.js',
], function (Swiper) {
	var swiper = new window.Swiper($widget.find('.swiper-container'), {
		slidesPerView: 'auto',
		spaceBetween: 20,
	});
});
