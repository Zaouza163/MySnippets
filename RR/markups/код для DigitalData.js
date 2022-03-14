var waitFor = function (exitCondition, callback, force, opts) {
	var checkCount = (opts && opts.checkCount) || 100;
	var timeout = (opts && opts.timeout) || 1000;

	(function check() {
		var result = exitCondition();
		if (result) {
			callback(result);
			return;
		}

		if (checkCount === 0) {
			if (force) {
				callback();
			}
			return;
		}

		checkCount -= 1;
		setTimeout(check, timeout);
	})();
};

var DDControler = function (modRecoms, listname) {
	var digitalDataRecoms = [];

	function setDigitalData(modRecoms, listname) {
		waitFor(
			function () {
				return 'digitalData' in window;
			},
			function () {
				modRecoms.forEach(function (recom, i) {
					var unitPrice =
						recom.OldPrice > recom.Price ? recom.OldPrice : recom.Price;
					var digitalDataViewedRecom = {
						position: i + 1,
						listName: listname,
						product: {
							id: String(recom.ItemId),
							skuCode: String(recom.ItemId),
							name: recom.Name,
							unitPrice: unitPrice,
							unitSalePrice: recom.Price,
							manufacturer: recom.Vendor,
							currency: 'RUB',
						},
					};

					digitalDataRecoms.push(digitalDataViewedRecom);
				});

				digitalData.events.push({
					category: 'Ecommerce',
					name: 'Viewed Product',
					listItems: digitalDataRecoms,
					source: 'RetailRocket',
				});
			}
		);
	}

	function digitalDataClick(indexItem) {
		digitalData.events.push({
			category: 'Ecommerce',
			name: 'Clicked Product',
			listItem: digitalDataRecoms[indexItem],
			source: 'RetailRocket',
		});
	}

	this.digitalDataClick = digitalDataClick;
	this.setDigitalData = setDigitalData;
	this.digitalDataRecoms = digitalDataRecoms;
};

retailrocket['store{{data-retailrocket-markup-block}}'] = (function () {
	var ddControler = new DDControler(); // Заводим новый экземпляр

	function preRenderFn(widget, recoms, renderFn) {
		if (recoms.length > 0) {
			ddControler.setDigitalData(recoms, 'Home Page - Personal'); //Возвращаем устанавливаем Data
			renderFn(recoms);
		}
	}

	return {
		preRenderFn: preRenderFn,
		digitalDataClick: ddControler.digitalDataClick, //Возвращаем клик
	};
})();
