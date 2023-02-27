function preRenderFn(widget, recoms, renderFn) {
  var categoryId = widget.getAttribute('data-algorithm-argument');

  retailrocket.impression.forCategoryPlacement({
    partnerId: retailrocket.api.getPartnerId(),
    placementId: '9b7c23c8-ec49-4b2a-8eba-5f41dda1267a', //... placementId кампании в API
    categoryId: categoryId,
    session: retailrocket.api.getSessionId(),
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