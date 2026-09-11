import * as DString from "@duplojs/lang/string";

export function createIdentifier(identifier: string) {
	return `${DString.uncapitalize(identifier)}DataStructure`;
}
