function getPopularItems(categ, callback) {
  retailrocket.recommendation.forCategories(
    retailrocket.api.getPartnerId(),
    categ, // categoryIds
    'popular',
    {}, // params
    callback,
  );
}

getPopularItems([123456, 7891011], function (popularRecoms) {
  console.log(popularRecoms);
});