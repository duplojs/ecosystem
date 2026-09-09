import type { NormalizeForm } from "./types";

export function normalize<
	GenericString extends string,
>(
	form: NormalizeForm,
): (
	string: GenericString,
) => string;

export function normalize<
	GenericString extends string,
>(
	string: GenericString,
	form: NormalizeForm,
): string;

export function normalize(
	...args:
		| [form: NormalizeForm]
		| [string: string, form: NormalizeForm]
): any {
	if (args.length === 1) {
		const [form] = args;

		return (string: string) => normalize(string, form);
	}

	const [string, form] = args;

	return string.normalize(form);
}
