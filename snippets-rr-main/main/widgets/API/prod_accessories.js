function getAccessoriesProducts(productIds, callback) {
  retailrocket.recommendation.forProducts(
    retailrocket.api.getPartnerId(),
    productIds,
    'accessories',
    {},//params
    callback,
  );
}

getAccessoriesProducts([123456, 7891011], function (accessoriesProducts) {
  console.log(accessoriesProducts);
})