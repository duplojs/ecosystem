import type { Email } from "./constraints";

export const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export function isEmail<
	GenericString extends string,
>(
	string: GenericString,
): string is GenericString & Email;

export function isEmail(
	string: string,
): any {
	return emailRegex.test(string);
}
