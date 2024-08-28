function getLatestItems(category, callback) {
  retailrocket.recommendation.forCategories(
    retailrocket.api.getPartnerId(),
    category, // categoryIds [0] если нужны просто новинки,
    'latest',
    {}, // params
    callback,
  );
}

getLatestItems([0], function (latestRecoms) {
  console.log(latestRecoms);
})
