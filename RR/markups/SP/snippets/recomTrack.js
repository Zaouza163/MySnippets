/** recomTrackSetting
* 
* @param {String} nameTrack - Название recomTrack. Указывается в т3.
* @param {String} namePage - Опционально. recomTrack с названием страницы. Указывается в т3. 
* @param {String} abSegment - Опционально. Id сегмента Ab-test.
* @param {boolean} check - Флаг отправки recomTrack. Изменяется при наличии выдачи SP.
*/

var recomTrackSetting = {
  nameTrack: '',
  namePage: '',
  abSegment: '',
  check: false,

  listTrack() {
    var defaultTrack = [this.nameTrack];

    if (this.namePage !== '') defaultTrack.push(this.nameTrack + this.namePage);
    return defaultTrack;
  },
};

function setStatisticsRender(recoms) {
  if (recomTrackSetting.check) {
    var itemsId = recoms.map(function (product) { return product.ItemId });

    recomTrackSetting.listTrack().forEach(function (track) {
      rrApiOnReady.push(function () {
        rrApi.recomTrack(
          '{{data-retailrocket-markup-block}}',
          0,
          [itemsId],
          {
            eventType: 'blockRender',
            abtest: recomTrackSetting.abSegment,
            algorithm: track
          }
        );
      });
    });
  }
}

function setStatisticsShow(recomIds) {
  if (recomTrackSetting.check) {
    recomTrackSetting.listTrack().forEach(function (track) {
      rrApiOnReady.push(function () {
        rrApi.recomTrack(
          '{{data-retailrocket-markup-block}}',
          0,
          [recomIds],
          {
            eventType: 'blockView',
            abtest: recomTrackSetting.abSegment,
            algorithm: track
          }
        );
      });
    });
  }
}

function setStatisticsClick(itemId) {
  if (recomTrackSetting.check) {
    recomTrackSetting.listTrack().forEach(function (track) {
      rrApiOnReady.push(function () {
        rrApi.recomTrack(
          '{{data-retailrocket-markup-block}}',
          0,
          [],
          {
            eventType: 'blockClick',
            clickedItem: itemId,
            abtest: recomTrackSetting.abSegment,
            algorithm: track
          }
        );
      });
    });
  }
}