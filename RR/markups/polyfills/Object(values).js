if (!Object.values) {
	Object.values = function (object) {
		Object.keys(object).map(function (key) {
			return o[key];
		});
	};
}
