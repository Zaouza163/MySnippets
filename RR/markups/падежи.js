/**
 * Returns the word in the correct case depending on the digit
 *
 * @param {number} n The number based on which the case of the word is needed
 * @param {array} title An array of words in different cases
 * @return {string} a word from the title array in the desired case
 *
 */

function declOfNum(n, titles) {
	return titles[
		n % 10 === 1 && n % 100 !== 11
			? 0
			: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
			? 1
			: 2
	];
}

// used example
declOfNum(2, ['отзыв', 'отзыва', 'отзывов']);
