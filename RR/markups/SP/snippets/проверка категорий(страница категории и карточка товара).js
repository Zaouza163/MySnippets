/**
 * ids - перечень id категорий из ТЗ
 */

var needCategories = [ids];

function checkCategoryMatch(pageCategory) {
	return needCategories.some(function (category) {
		return category == pageCategory;
	});
}

// for card pages

function getItems(requireProducts, callback) {
	retailrocket.items.get(
		retailrocket.api.getPartnerId(),
		requireProducts,
		callback
	);
}

getItems(productList, function (currentProducts) {
	var category = currentProducts[0].CategoryIds[0],
		categoryMatch = checkCategoryMatch(category);

	if (categoryMatch) {
		// category is matched
	} else {
		// category is not matched
	}
});

// for category pages

var pageCategory = '{{data-category-id}}',
	categoryMatch = checkCategoryMatch(pageCategory);