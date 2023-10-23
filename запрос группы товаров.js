function getGroupItems([GroupId], callback) {
	retailrocket.items.getByGroupId(
    {
      partnerId: retailrocket.api.getPartnerId(),
      groupIds: [GroupId],
      stockId: '{{data-stock}}'// stock, if any
    },
		callback
	);
}

getGroupItems(["29686200299"], function (groupIdProducts) {
  console.log(groupIdProducts)
})