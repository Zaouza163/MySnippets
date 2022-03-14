function getItems(requireProducts, callback) {
	retailrocket.items.get(
		retailrocket.api.getPartnerId(),
		requireProducts,
		['{{data-stock}}'], // сток, если он необходим
		callback
	);
}

var productList = '{{data-product-id}}'.split(',');

getItems(productList, function (currentProducts) {
	currentProducts.forEach(function (recom) {});
});