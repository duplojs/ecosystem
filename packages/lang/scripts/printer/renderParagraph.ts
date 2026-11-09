import * as DArray from "@scripts/array";
import * as DString from "@scripts/string";
import { Back } from "./back";
import { collectPrintableValues, resolveIndent, type IndentParams } from "./helpers";
import type { RenderInput } from "./types";

const backCharacters = {
	LF: "\n",
	CRLF: "\r\n",
} as const satisfies Record<Back, string>;

export interface RenderParagraphParams extends IndentParams {
	back?: Back;
}

export function renderParagraph(params: RenderParagraphParams): (values: readonly RenderInput[]) => string;

export function renderParagraph(values: readonly RenderInput[], params?: RenderParagraphParams): string;

export function renderParagraph(
	...args:
		| [params: RenderParagraphParams]
		| [values: readonly RenderInput[], params?: RenderParagraphParams]
): any {
	const [values, params = {}] = args;

	if (!DArray.is(values)) {
		return (input: readonly RenderInput[]) => renderParagraph(input, values);
	}

	const printableValues = collectPrintableValues(values);

	if (printableValues.length === 0) {
		return "";
	}

	const result = DString.join(printableValues, backCharacters[params.back ?? Back.LF]);
	const indent = resolveIndent(params);

	return DString.replace(result, /(^|\n)/g, ({ matchedValue }) => `${matchedValue}${indent}`);
}
