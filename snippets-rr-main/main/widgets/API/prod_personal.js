function getPersonalItems(category, callback) {
  retailrocket.recommendation.forCategories(
    retailrocket.api.getPartnerId(),
    category, // categoryIds [0] если нужны просто персональные рекомендации
    'personal',
    {}, // params
    callback,
  );
}

getPersonalItems([0], function (personalRecoms) {
  console.log(personalRecoms);
})