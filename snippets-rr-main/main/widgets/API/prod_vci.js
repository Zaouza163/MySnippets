function getVCI(callback) {
  retailrocket.recommendation.forVisitorCategoryInterest(
    retailrocket.api.getPartnerId(),
    retailrocket.api.getSessionId(),
    'popular',
    {}, //params
    callback,
  );
}

getVCI(function (data) {
  console.log(data);
})