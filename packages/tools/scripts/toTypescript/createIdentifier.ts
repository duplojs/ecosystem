const invalidIdentifierPartRegExp = /[^A-Za-z0-9_$]+(?<nextCharacter>.)?/g;
const validIdentifierStartRegExp = /^[A-Za-z_$]/;

export function createIdentifier(identifier: string): string {
	let result = identifier
		.trim()
		.replace(
			invalidIdentifierPartRegExp,
			(__, character: string | undefined) => character?.toUpperCase() ?? "",
		);

	if (!result) {
		return "Type";
	}

	result = result[0]!.toUpperCase() + result.slice(1);

	if (!validIdentifierStartRegExp.test(result)) {
		result = `_${result}`;
	}

	return result;
}
