/**
 *
 * @param {Array} categoryIds - массив с id категорий или массив categoryPath
 * @param {Object} params - доп.параметры,например, {stock:'moscow', vendor: 'nike';}
 * @param {Function} callback - возвращает массив с рекомендациями
 */

function getPopularItems(callback) {
	retailrocket.recommendation.forCategories(
		retailrocket.api.getPartnerId(),
		[0], // categoryIds
		'popular',
		{}, // params
		callback
	);
}

function getLatestItems(callback) {
  retailrocket.recommendation.forCategories(
    retailrocket.api.getPartnerId(),
    [0], // categoryIds
    'latest',
    {}, // params
    callback
  );
}

function getPersonalItems(callback) {
	retailrocket.recommendation.forCategories(
		retailrocket.api.getPartnerId(),
		[0], // categoryIds
		'personal',
		{}, // params
		callback
	);
}

//Запрос персональных рекомендаций категорий по упрощенной интеграции
function getPersonalItemsFromCat(categoryName, callback) {
  retailrocket.recommendation.forPerson(
    retailrocket.api.getPartnerId(),
    retailrocket.api.getSessionId(),
    null,
    'compositeForCategory',
    {'categoryPaths':[categoryName]},
    callback
  );
}

//получение id категорий интересных пользователю
function getCategoryInterest(callback) {
  retailrocket.recommendation.forInterestedCategories(
		retailrocket.api.getPartnerId(),
    retailrocket.api.getSessionId(),
		{}, // params
		callback
	);
}

// Пример использования

getPopularItems(function (popularItems) {
	console.log(popularItems);
});

getPersonalItems(function (personalItems) {
	console.log(personalItems);
});

getLatestItems(function (latestItems) {
	console.log(latestItems);
});
