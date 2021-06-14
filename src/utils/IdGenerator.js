const { customAlphabet } = require("nanoid/async");

async function createId() {
	const alphabet =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	const nanoid = customAlphabet(alphabet, 10);
	let id = await nanoid();
	return id;
}

module.exports = createId;
