/**
 *
 * Get Google Fonts URL for all variable axes
 *
 * Doing this via Node to circumvent CORS stuff.
 *
 * Author: Roel Nieskens <roel@pixelambacht.nl>
 *
 */

const fetch = require("node-fetch");

const fontURL = "https://fonts.google.com/metadata/fonts";

fetch(fontURL)
	.then((res) => res.text())
	.then((originalJSON) => {
		const json = parseJSON(originalJSON);
		const variableFonts = getVF(json);
		const cssURLs = constructURLs(variableFonts);

		console.log(JSON.stringify(cssURLs));
	});

// Original JSON is invalid as it contains garbage on the first line, so clean
// up and parse
const parseJSON = (json) => {
	let lines = json.split("\n");
	lines.splice(0, 1);
	return JSON.parse(lines.join("\n"));
};

// Return fonts with variable axes
const getVF = (json) => {
	return json["familyMetadataList"].filter((f) => f.axes.length > 0);
};

// Construct URL for all axes to fonts.googleapis.com
const constructURLs = (fonts) => {
	const startURL = "https://fonts.googleapis.com/css2?family=";
	const endURL = "&display=block";

	let URLs = {};

	for (const font of fonts) {
		const axes = getAllAxes(font);
		const ital = hasItal(font);

		// Get axes
		let axisNames = [];
		let axisValues = [];
		for (const axis of axes) {
			axisNames.push(axis.tag);
			axisValues.push(`${axis.min}..${axis.max}`);
		}

		// Add regular font family, optinally italic
		let cssURL = [];
		cssURL.push(startURL);
		cssURL.push(encodeURI(font.family));
		cssURL.push(":");
		let italicCssURL = [...cssURL];

		// Regular
		cssURL.push(axisNames.join(","));
		cssURL.push("@");
		cssURL.push(axisValues.join(","));
		cssURL.push(endURL);
		URLs[font.family] = {
			css: cssURL.join(""),
			subsets: font.subsets.filter((s) => s !== "menu"),
		};

		// Italic
		if (ital) {
			italicCssURL.push("ital,");
			italicCssURL.push(axisNames.join(","));
			italicCssURL.push("@");
			italicCssURL.push("1,");
			italicCssURL.push(axisValues.join(","));
			italicCssURL.push(endURL);
			URLs[`${font.family} Italic`] = {
				css: italicCssURL.join(""),
				subsets: font.subsets.filter((s) => s !== "menu"),
			};
		}
	}
	return URLs;
};

// Return all variable axes, sorted how the Google API likes it
const getAllAxes = (font) => {
	const allUnsortedAxes = [...font.axes, ...font.unsupportedAxes];

	// Google says: "Axes must be listed alphabetically (e.g. a,b,c,A,B,C)".
	// Which isn't technically alphabetically as A should come before a. So split
	// lowercase axes and uppercase axes.
	let lowercaseAxes = [];
	let uppercaseAxes = [];
	for (const axis of allUnsortedAxes) {
		if (axis.tag === axis.tag.toLowerCase()) {
			lowercaseAxes.push(axis);
		} else {
			uppercaseAxes.push(axis);
		}
	}
	lowercaseAxes.sort((a, b) => (a.tag > b.tag ? 1 : -1));
	uppercaseAxes.sort((a, b) => (a.tag > b.tag ? 1 : -1));

	return [...lowercaseAxes, ...uppercaseAxes];
};

// The JSON doesn't list `ital` as an axis, so we have to deduct this from the
// `fonts` data (e.g. see if styles ending with "i" are present, like "400i")
const hasItal = (font) => {
	const italicFonts = Object.keys(font.fonts).filter((f) => f.endsWith("i"));
	return italicFonts.length > 0;
};
