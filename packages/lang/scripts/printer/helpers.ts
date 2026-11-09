import * as DArray from "@scripts/array";
import * as DString from "@scripts/string";
import * as DNumber from "@scripts/number";
import type { Indent } from "./indent";
import type { RenderInput } from "./types";

const indentCharacters = {
	tab: "\t",
	space1: " ",
	space2: "  ",
	space3: "   ",
	space4: "    ",
} as const satisfies Record<Indent, string>;

export interface IndentParams {
	indent?: Indent;
	indentLevel?: number;
}

export function resolveIndent(params: IndentParams) {
	const level = Math.trunc(params.indentLevel ?? 0);

	if (!params.indent || !DNumber.isPositive(level) || !DNumber.isInteger(level)) {
		return "";
	}

	return DString.repeat(indentCharacters[params.indent], level);
}

export function collectPrintableValues(values: readonly RenderInput[]) {
	return DArray.map(
		DArray.filter(
			DArray.flat(values, Number.POSITIVE_INFINITY),
			(value): value is string | true => typeof value === "string" || value === true,
		),
		(value) => value === true ? "true" : value,
	);
}
