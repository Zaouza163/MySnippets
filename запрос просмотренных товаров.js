function getPersonalItems(callback) {
  retailrocket.recommendation.forCategories(
    retailrocket.api.getPartnerId(),
    [0],
    'viewed',
    {algorithmType: 'personal'},
    callback
  );
}