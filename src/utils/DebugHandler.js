function debug(fileName, lineNumber, message, payload) {
	console.log({
		fileName,
		lineNumber,
		message,
		payload,
	});
}

module.exports = debug;
