function getRelatedProducts(productIds, callback) {
	retailrocket.recommendation.forProducts(
		retailrocket.api.getPartnerId(),
		productIds,
		'related',
		{}, // params
		callback
	);
}

getRelatedProducts([123456, 7891011], function (relatedRecoms) {
	console.log(relatedRecoms);
});