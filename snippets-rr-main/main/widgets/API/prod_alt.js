function getAlternativeProducts(productIds, callback) {
	retailrocket.recommendation.forProducts(
		retailrocket.api.getPartnerId(),
		productIds,
		'alternative',
		{}, // params
		callback
	);
}

getAlternativeProducts([123456], function (alternativeProducts) {
	console.log(alternativeProducts);
});