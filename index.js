const fetch = require("node-fetch");

const fontURL = "https://fonts.google.com/metadata/fonts";

fetch(fontURL)
	.then((res) => res.text())
	.then((originalJSON) => {
		const json = parseJSON(originalJSON);
		const variableFonts = getVF(json);
		const allURLs = constructURLs(variableFonts);

		console.log(allURLs);
	});

// Original JSON is invalid as it contains garbage
// on the first line, so clean up and parse
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

	let URLs = [];

	for (const font of fonts) {
		const axes = getAllAxes(font);
		const ital = hasItal(font);

		// Add font family
		let fontURL = [];
		fontURL.push(startURL);
		fontURL.push(encodeURI(font.family));
		fontURL.push(":");

		// Add axes
		let axisNames = [];
		let axisValues = [];
		for (const axis of axes) {
			axisNames.push(axis.tag);
			axisValues.push(`${axis.min}..${axis.max}`);
		}

		// Since `ital` is not listed as an axis, add
		// it manually
		if (ital) {
			fontURL.push("ital,");
		}

		fontURL.push(axisNames.join(","));
		fontURL.push("@");

		// For fonts with `ital`, list other axes twice,
		// once for regular and once for italic
		if (ital) {
			fontURL.push("0,");
			fontURL.push(axisValues.join(","));
			fontURL.push(";1,");
		}

		fontURL.push(axisValues.join(","));

		fontURL.push(endURL);

		URLs.push(fontURL.join(""));
	}
	return URLs;
};

// Return all variable axes, sorted how the Google API likes it
const getAllAxes = (font) => {
	const allUnsortedAxes = [...font.axes, ...font.unsupportedAxes];

	// Google says: "Axes must be listed alphabetically (e.g. a,b,c,A,B,C)"
	// Which isn't technically alphabetically as A should come before a.
	// So split lowercase axes and uppercase axes.
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

// The JSON doesn't list `ital` as an axis, so we have
// to deduct this from the `fonts` data (e.g. see if
// styles ending with "i" are present, like "400i")
const hasItal = (font) => {
	const italicFonts = Object.keys(font.fonts).filter((f) => f.endsWith("i"));
	return italicFonts.length > 0;
};
