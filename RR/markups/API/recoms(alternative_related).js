/**
 *
 * @param {Array} productIds - массив с id товаров/товара
 * @param {Object} params - доп.параметры,например, {stock:'moscow'}
 * @param {Function} callback - возвращает массив с рекомендациями
 */

function getAlternativeProducts(productIds, callback) {
	retailrocket.recommendation.forProducts(
		retailrocket.api.getPartnerId(),
		productIds,
		'alternative',
		{}, // params
		callback
	);
}

function getRelatedProducts(productIds, callback) {
	retailrocket.recommendation.forProducts(
		retailrocket.api.getPartnerId(),
		productIds,
		'related',
		{}, // params
		callback
	);
}

// Пример использования

getAlternativeProducts([123456], function (alternativeProducts) {
	console.log(alternativeProducts);
});

getRelatedProducts([123456, 7891011], function (alternativeProducts) {
	console.log(alternativeProducts);
});
