function getGroupIdsItems(groupIds = [], callback) {
  retailrocket.items.getByGroupId({
    partnerId: retailrocket.api.getPartnerId(),
    groupIds,
    stockId: '<stockId>'
  }, callback);
}

getGroupIdsItems([123456, 7891011], function (groupItems) {
  console.log(groupItems);
})