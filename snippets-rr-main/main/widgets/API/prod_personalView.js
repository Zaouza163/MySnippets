function getPersonalViewedItems(callback) {
  retailrocket.recommendation.forPerson(
    retailrocket.api.getPartnerId(),
    retailrocket.api.getSessionId(),
    '',
    'viewed',
    {},//params
    callback,
  );
}

getPersonalViewedItems(function (data) {
  console.log(data);
})