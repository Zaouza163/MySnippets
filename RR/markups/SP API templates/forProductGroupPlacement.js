function preRenderFn(widget, recoms, renderFn) {
  var productList = widget.getAttribute('data-algorithm-argument');

  retailrocket.impression.forProductGroupPlacement({
    partnerId: retailrocket.api.getPartnerId(),
    placementId: '4f05d7a1-bb1a-40af-98d1-ada023bdb86d', //... placementId кампании в API
    session: retailrocket.api.getSessionId(),
    productIds: productList,
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

        getItems(SPids, function (spProducts) {
          var spRecoms = spProducts.filter(filterIsAvailable);

          spRecoms.forEach(function (recom) {
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