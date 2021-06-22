const { customAlphabet } = require("nanoid/async");

async function createId() {
	const alphabet =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	const lengthOfId = 10;

	const nanoid = customAlphabet(alphabet, lengthOfId);
	let id = await nanoid();

	return id;
}

module.exports = createId;
