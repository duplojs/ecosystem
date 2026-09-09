import type { Url } from "./constraints";

export function isUrl<
	GenericValue extends string,
>(
	string: GenericValue,
): string is GenericValue & Url;

export function isUrl(
	string: string,
) {
	try {
		new URL(string);
		return true;
	} catch {
		return false;
	}
}
