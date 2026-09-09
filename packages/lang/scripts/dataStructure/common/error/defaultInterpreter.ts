import * as DArray from "@scripts/array";
import * as DString from "@scripts/string";
import { encodeIssueKind } from "./base";
import { codecsJson, codecsString } from "../codec";
import { type CodecDictionaryParams, type StructureDictionaryParams } from "./interpreter";

export const defaultErrorInterpreterDataStructureDictionary = {
	"@DuplojsLangDataStructure/array-structure": () => "Expected an array.",
	"@DuplojsLangDataStructure/lazy-structure": () => "Expected a value matching the resolved structure.",
	"@DuplojsLangDataStructure/non-encodable-string-structure": (source) => `Expected ${DString.stringify(source.definition.value)}.`,
	"@DuplojsLangDataStructure/object-structure": () => "Expected a plain object containing only the defined properties.",
	"@DuplojsLangDataStructure/record-structure": () => "Expected a plain object matching the record definition.",
	"@DuplojsLangDataStructure/type-structure": () => "Expected a value matching the configured type.",
	"@DuplojsLangDataStructure/union-structure": () => "Expected a value matching at least one union member.",

	"@DuplojsLangDataStructure/bigint-type": () => "Expected a bigint.",
	"@DuplojsLangDataStructure/bigint-literal-type": (source) => `Expected ${DString.to(source.definition.value)}n.`,
	"@DuplojsLangDataStructure/boolean-type": () => "Expected a boolean.",
	"@DuplojsLangDataStructure/boolean-literal-type": (source) => `Expected ${source.definition.value}.`,
	"@DuplojsLangDataStructure/date-type": () => "Expected a DuploJS date.",
	"@DuplojsLangDataStructure/null-type": () => "Expected null.",
	"@DuplojsLangDataStructure/number-type": () => "Expected a finite number.",
	"@DuplojsLangDataStructure/number-literal-type": (source) => `Expected ${source.definition.value}.`,
	"@DuplojsLangDataStructure/string-type": () => "Expected a string.",
	"@DuplojsLangDataStructure/string-literal-type": (source) => `Expected ${DString.stringify(source.definition.value)}.`,
	"@DuplojsLangDataStructure/time-type": () => "Expected a DuploJS time.",
	"@DuplojsLangDataStructure/undefined-type": () => "Expected undefined.",

	"@DuplojsLangDataStructure/absolute-path-constraint": () => "Expected an absolute path.",
	"@DuplojsLangDataStructure/allowed-characters-constraint": (source) => `Expected a string containing only characters from ${DString.join(DArray.coalescing(source.definition.charactersRange), ", ")}.`,
	"@DuplojsLangDataStructure/array-length-equal-constraint": (source) => `Expected an array containing exactly ${source.definition.length} elements.`,
	"@DuplojsLangDataStructure/between-than-constraint": (source) => `Expected a number greater than ${source.definition.greater} and less than ${source.definition.less}.`,
	"@DuplojsLangDataStructure/between-than-or-equal-constraint": (source) => `Expected a number greater than or equal to ${source.definition.greater} and less than or equal to ${source.definition.less}.`,
	"@DuplojsLangDataStructure/email-constraint": () => "Expected a valid email address.",
	"@DuplojsLangDataStructure/even-constraint": () => "Expected an even number.",
	"@DuplojsLangDataStructure/greater-than-constraint": (source) => `Expected a number greater than ${source.definition.threshold}.`,
	"@DuplojsLangDataStructure/greater-than-or-equal-constraint": (source) => `Expected a number greater than or equal to ${source.definition.threshold}.`,
	"@DuplojsLangDataStructure/integer-constraint": () => "Expected an integer.",
	"@DuplojsLangDataStructure/less-than-constraint": (source) => `Expected a number less than ${source.definition.threshold}.`,
	"@DuplojsLangDataStructure/less-than-or-equal-constraint": (source) => `Expected a number less than or equal to ${source.definition.threshold}.`,
	"@DuplojsLangDataStructure/max-characters-constraint": (source) => `Expected a string containing at most ${source.definition.max} characters.`,
	"@DuplojsLangDataStructure/max-elements-constraint": (source) => `Expected an array containing at most ${source.definition.max} elements.`,
	"@DuplojsLangDataStructure/min-characters-constraint": (source) => `Expected a string containing at least ${source.definition.min} characters.`,
	"@DuplojsLangDataStructure/min-elements-constraint": (source) => `Expected an array containing at least ${source.definition.min} elements.`,
	"@DuplojsLangDataStructure/multiple-of-constraint": (source) => `Expected a multiple of ${source.definition.multiple}.`,
	"@DuplojsLangDataStructure/negative-constraint": () => "Expected a number less than or equal to zero.",
	"@DuplojsLangDataStructure/not-empty-constraint": () => "Expected a non-empty string.",
	"@DuplojsLangDataStructure/not-zero-constraint": () => "Expected a non-zero number.",
	"@DuplojsLangDataStructure/number-in-string-constraint": () => "Expected a string representing a number.",
	"@DuplojsLangDataStructure/odd-constraint": () => "Expected an odd number.",
	"@DuplojsLangDataStructure/path-constraint": () => "Expected a valid path.",
	"@DuplojsLangDataStructure/positive-constraint": () => "Expected a number greater than or equal to zero.",
	"@DuplojsLangDataStructure/refine-constraint": () => "Expected a value satisfying the custom refinement.",
	"@DuplojsLangDataStructure/regex-constraint": (source) => `Expected a string matching ${source.definition.regex.toString()}.`,
	"@DuplojsLangDataStructure/safe-constraint": () => "Expected a number strictly between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER.",
	"@DuplojsLangDataStructure/segment-path-constraint": () => "Expected a valid path segment.",
	"@DuplojsLangDataStructure/strict-negative-constraint": () => "Expected a number less than zero.",
	"@DuplojsLangDataStructure/strict-positive-constraint": () => "Expected a number greater than zero.",
	"@DuplojsLangDataStructure/string-length-equal-constraint": (source) => `Expected a string containing exactly ${source.definition.length} characters.`,
	"@DuplojsLangDataStructure/trimmed-constraint": () => "Expected a string without leading or trailing whitespace.",
	"@DuplojsLangDataStructure/url-constraint": () => "Expected a valid URL.",
	"@DuplojsLangDataStructure/uuid-constraint": () => "Expected a valid UUID.",

	"@DuplojsLangModeling/entity-structure": () => "Expected a valid entity object.",
	"@DuplojsLangModeling/new-type-structure": () => "Expected a value matching the branded type.",
	"@DuplojsLangModeling/tagged-object-structure": (source) => `Expected a plain object matching one of the tagged variants of ${source.name}.`,
} as const satisfies Required<StructureDictionaryParams>;

const createDefaultCodecErrorMessage = (
	codecName: string,
	encodedValueDescription: string,
	decodedValueDescription: string,
): CodecDictionaryParams[number][1] => (
	_codec,
	issue,
) => {
	if (issue.from === "predicate") {
		return encodeIssueKind.has(issue)
			? `The ${codecName} codec must produce ${encodedValueDescription}.`
			: `Expected ${encodedValueDescription} for the ${codecName} codec.`;
	}

	if (issue.from === "encoding") {
		return `The ${codecName} codec could not encode ${decodedValueDescription}.`;
	}

	if (issue.from === "decoding") {
		return `The ${codecName} codec could not decode the value as ${decodedValueDescription}.`;
	}

	return `The ${codecName} codec encountered an external error while ${encodeIssueKind.has(issue) ? "encoding" : "decoding"}.`;
};

export const defaultErrorInterpreterCodecDictionary = [
	[
		codecsJson.definition.bigint,
		createDefaultCodecErrorMessage("JSON bigint", "a string", "a bigint"),
	],
	[
		codecsJson.definition.date,
		createDefaultCodecErrorMessage("JSON date", "a string", "a DuploJS date"),
	],
	[
		codecsJson.definition.time,
		createDefaultCodecErrorMessage("JSON time", "a string", "a DuploJS time"),
	],
	[
		codecsString.definition.bigint,
		createDefaultCodecErrorMessage("string bigint", "a string", "a bigint"),
	],
	[
		codecsString.definition.boolean,
		createDefaultCodecErrorMessage("string boolean", "the string \"true\" or \"false\"", "a boolean"),
	],
	[
		codecsString.definition.date,
		createDefaultCodecErrorMessage("string date", "a string", "a DuploJS date"),
	],
	[
		codecsString.definition.null,
		createDefaultCodecErrorMessage("string null", "the string \"null\"", "null"),
	],
	[
		codecsString.definition.number,
		createDefaultCodecErrorMessage("string number", "a string representing a number", "a finite number"),
	],
	[
		codecsString.definition.time,
		createDefaultCodecErrorMessage("string time", "a string", "a DuploJS time"),
	],
	[
		codecsString.definition.undefined,
		createDefaultCodecErrorMessage("string undefined", "the string \"undefined\"", "undefined"),
	],
] as const satisfies CodecDictionaryParams;
