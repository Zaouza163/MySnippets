/**
 * getRandomValue - задаем диапазон от 0 до 100
 * getRandomBrand - задаем шансы для каждого бренда в числовом диапозоне
 */

function getRandomValue(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function getRandomBrand() {
	var chance = getRandomValue(0, 100),
		brand = '';

	if (chance >= 0 && chance < 42) {
		brand = 'Head & Shoulders';
	} else if (chance >= 42 && chance < 57) {
		brand = 'HERBAL ESSENCES';
	} else if (chance >= 57 && chance < 91) {
		brand = 'Pantene';
	} else {
		brand = 'Aussie';
	}

	return brand;
}

var SPvendor = getRandomBrand();