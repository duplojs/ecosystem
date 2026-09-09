import * as DKind from "@scripts/kind";

export function keys<
	GenericObject extends object,
>(object: GenericObject): `${Exclude<keyof GenericObject, symbol>}`[];

export function keys(object: object): string[] {
	const result = [];

	for (const key in object) {
		if (!DKind.isRuntimeKey(key)) {
			result.push(key);
		}
	}

	return result;
}
