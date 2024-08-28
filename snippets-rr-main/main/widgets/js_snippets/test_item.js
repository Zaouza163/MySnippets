//Тест опредленных товаров

function getItems(requireProducts, callback) {
  retailrocket.items.get(
    retailrocket.api.getPartnerId(),
    requireProducts,
    [], //stock
    callback
  );
}

function testPreRender(rec, rFunc) {
  getItems([19809 /* id товаров */], function (tR) {
    var nR = tR.concat(rec);

    rFunc(nR) //renderFn
  })
}

testPreRender(recoms, renderFn)