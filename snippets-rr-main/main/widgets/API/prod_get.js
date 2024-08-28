function getItems(requireProducts, callback) {
	retailrocket.items.get(
		retailrocket.api.getPartnerId(),
		requireProducts,
		['{{data-stock}}'], // сток, если он необходим
		callback
	);
}

var productList = '{{data-product-id}}'.split(',').map(function (item) { return Number(item) });

getItems(productList, function (currentProducts) {
	console.log(currentProducts);
});