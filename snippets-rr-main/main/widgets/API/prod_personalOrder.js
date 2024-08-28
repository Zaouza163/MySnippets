function getPersonalOrderedItems(callback) {
  retailrocket.recommendation.forPerson(
    retailrocket.api.getPartnerId(),
    retailrocket.api.getSessionId(),
    '',
    'ordered',
    {}, //params
    callback,
  );
}

getPersonalOrderedItems(function (data) {
  console.log(data);
})