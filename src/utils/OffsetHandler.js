function handleOffset(offset) {
	if (!offset) return { error: "error" };

	let numberTester = /^[0-9]+$/;

	if (!numberTester.test(offset)) return { error: "error" };

	offset = parseInt(offset);

	if (offset < 0) return { error: "error" };

	return { message: offset };
}

module.exports = handleOffset;
