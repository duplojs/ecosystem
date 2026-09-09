export function test<
	GenericString extends string,
>(
	regExp: RegExp,
): (
	string: GenericString,
) => boolean;

export function test<
	GenericString extends string,
>(
	string: GenericString,
	regExp: RegExp,
): boolean;

export function test(
	...args:
		| [regExp: RegExp]
		| [string: string, regExp: RegExp]
) {
	if (args.length === 1) {
		const [regExp] = args;

		return (string: string) => test(string, regExp);
	}

	const [string, regExp] = args;

	return regExp.test(string);
}
