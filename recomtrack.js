var recomTrackSetting = {
  nameTrack: '',
  abSegment: '',
  check: false,
  listTrack: function()
  {
    return [this.nameTrack, this.nameTrack + 'Card'];
  },
};

function setStatisticsRelatedRender(ids, slicedRecoms) {
        var itemsId = slicedRecoms.map(function(product) { return product.ItemId });

        

        recomTrackSetting.listTrack().forEach(function(track) {
          rrApiOnReady.push(function() {
            rrApi.recomTrack(
              '{{data-retailrocket-markup-block}}',
              0,
              [itemsId],
              {
                itemIds: ids,
                recomItemIds: itemsId,
                eventType: 'blockBasket',
                abtest: recomTrackSetting.abSegment,
                algorithm: 'related'
              }
            );
          });
        });
      }