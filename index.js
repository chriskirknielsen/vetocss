module.exports = function vetoCss(styles, selectors) {
	/**
	 * More accurately check the type of a JavaScript object
	 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
	 * @param  {Object} obj The object
	 * @return {String}     The object type
	 */
	function getType(item) {
		return Object.prototype.toString.call(item).slice(8, -1).toLowerCase();
	}

	/** 
	 * Escape special RegExp characters from a string
	 * @param  {String} str The string to escape
	 * @return {String} 	Escaped string
	 */
	function strToRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	
	// No styles? Quit while we're ahead
	if (styles.trim().length === 0) {
		return '';
	}
	
	// Selector isn't an array? Make it into one
	if (['string','regexp'].indexOf(getType(selectors)) > -1) {
		selectors = [selectors];
	}
	
	// No selectors? No processing
	if (selectors.length === 0 || getType(selectors) !== 'array') {
		return styles;
	}

	// Run through each provided selector
	selectors.forEach(function(selector, index) {
		// Create a RegExp string from the selector that can be injected into a RegExp constructor
		let selectorRegExp = (getType(selector) === 'regexp') ? selector.source : strToRegExp(selector);

		// Build a RegExp for the selector - note all \ are escaped, hence the \\:
		//        1        2           3             4  5   6   7    Opt
		// (?<=\\{|\\}|^)\\s*' + selectorRegExp + '\\s*\\{[^}]+\\}', 'g'
		// 1: (?<=\{|\}|^) Positive lookbehind for a literal { or } character, or the very beginning of the string
		// 2: \s* Any (zero or more) whitespace character
		// 3: Injecting the CSS selector as a RegExp (either provided or converted, so .class will be \.class)
		// 4: (See 2)
		// 5: \{ Literal { character starting a CSS declaration block
		// 6: [^}]+ Any non-} character
		// 7: \} Literal } character closing a CSS declaration block
		// Opt: 'g' Global flag to prevent returning after the first match
		let fullSelector = new RegExp('(?<=\\{|\\}|^)\\s*' + selectorRegExp + '\\s*\\{[^}]+\\}', 'g');

		// Remove any CSS declaration blocks whose selector matches the RegExg
		styles = styles.replace(fullSelector, '');
	});

	// Return the fully processed stylesheet content, trimming whitespaces at the boundaries
	return styles.trim();
}