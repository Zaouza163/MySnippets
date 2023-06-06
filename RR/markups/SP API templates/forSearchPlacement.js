function preRenderFn(widget, recoms, renderFn) {
  var searchQuery = widget.getAttribute('data-algorithm-argument');

  retailrocket.impression.forSearchPlacement({
    partnerId: retailrocket.api.getPartnerId(),
    placementId: '7ba0e102-3c7f-454c-9167-e609768daa2d', //... placementId comp in API
    searchQuery: searchQuery,
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