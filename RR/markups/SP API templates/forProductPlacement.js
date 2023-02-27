function preRenderFn(widget, recoms, renderFn) {
  var productList = '{{data-product-id}}'.split(',');

  retailrocket.impression.forProductPlacement({
    partnerId: retailrocket.api.getPartnerId(),
    placementId: 'b6b7d516-ae5c-4d76-9479-b0b5d5b6e5ef', //... placementId кампании в API
    session: retailrocket.api.getSessionId(),
    productId: productList,
    callbackContents: {
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

        getItems(SPids, function(spProducts) {
          var spRecoms = spProducts.filter(filterIsAvailable);

          spRecoms.forEach(function(recom) {
            recom.Params.isSp = true;
          })

          if (spRecoms.length > 0) {
            recomTrackSetting.check = true;
            recomTrackSetting.nameTrack = SPinfoParsed.recomTrack;
            setStatisticsRender(spRecoms)
            renderFn(spRecoms);
          }
        });
      },
      'empty': function () {}
    }
  });
}