import * as DString from "@scripts/string";
import { collectPrintableValues, resolveIndent, type IndentParams } from "./helpers";
import type { RenderInput } from "./types";

export interface RenderLineParams extends IndentParams {
	joinCharacter?: string;
}

export function renderLine(values: readonly RenderInput[], params?: RenderLineParams): string;

export function renderLine(values: readonly RenderInput[], params: RenderLineParams = {}) {
	const printableValues = collectPrintableValues(values);

	if (printableValues.length === 0) {
		return "";
	}

	return `${resolveIndent(params)}${DString.join(printableValues, params.joinCharacter ?? " ")}`;
}
