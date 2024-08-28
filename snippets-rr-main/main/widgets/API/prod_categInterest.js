function getCategoryInterest(callback) {
  retailrocket.recommendation.forInterestedCategories(
    retailrocket.api.getPartnerId(),
    retailrocket.api.getSessionId(),
    {},//params
    callback,
  );
}

getCategoryInterest(function (data) {
  console.log(data);
})