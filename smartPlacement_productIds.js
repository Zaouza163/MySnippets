retailrocket.impression.forAnyPlacements({
  partnerId: retailrocket.api.getPartnerId(),
  placementId: '55ec3c2c-9818-4a0b-8583-5730f33d9fa7',
  session: retailrocket.api.getSessionId(),
  callbackContents: {
    'productIds': function (content) {
      var spProductsIds = content.productIds;
      impressionContentId = content.id;

      getItems(spProductsIds, function (spProducts) {
        var spRecoms = spProducts.filter(filterIsAvailable);

        spRecoms.forEach(function (recom) {
          recom.Params.isSp = true;
        })

        if (spRecoms.length > 0) {
          recomTrackSetting.check = true;
          recomTrackSetting.nameTrack = impressionContentId;
          setStatisticsRender(spRecoms);
          filterPriceUpdate(spRecoms);
        }
      })
    },
    'string': function (content) {
      if (typeof content === 'string') {
        var spInfoStr = content;
      } else {
        var spInfoStr = content.string;
        impressionContentId = content.id;
      }

      var SPinfoParsed = getParsedResponse(spInfoStr);
      var isRandom = SPinfoParsed.hasOwnProperty('randomProducts');
      var SPids = isRandom ? SPinfoParsed.randomProducts[getRandomValue(0, SPinfoParsed.randomProducts.length - 1)] : SPinfoParsed.products;

      getItems(SPids, function (spProducts) {
        var spRecoms = spProducts.filter(filterIsAvailable);

        spRecoms.forEach(function (recom) {
          recom.Params.isSp = true;
        })

        if (spRecoms.length > 0) {
          recomTrackSetting.check = true;
          recomTrackSetting.nameTrack = SPinfoParsed.recomTrack;
          setStatisticsRender(spRecoms)
          filterPriceUpdate(spRecoms);
        }
      });
    },
    'empty': function () {
      ddControler.digitalDataBlockError('Mobile main page', 'noData');
    }
  }
});