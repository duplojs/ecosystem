import { DDataStructure, type ExpectType, DModeling } from "@scripts";

describe("defaultErrorInterpreterDataStructureDictionary", () => {
	it("formats default structure messages", () => {
		const dictionary = DDataStructure.defaultErrorInterpreterDataStructureDictionary;

		expect([
			dictionary["@DuplojsLangDataStructure/array-structure"](),
			dictionary["@DuplojsLangDataStructure/lazy-structure"](),
			dictionary["@DuplojsLangDataStructure/non-encodable-string-structure"](
				DDataStructure.NonEncodableStringStructure("value \"quoted\""),
			),
			dictionary["@DuplojsLangDataStructure/object-structure"](),
			dictionary["@DuplojsLangDataStructure/record-structure"](),
			dictionary["@DuplojsLangDataStructure/type-structure"](),
			dictionary["@DuplojsLangDataStructure/union-structure"](),
		]).toStrictEqual([
			"Expected an array.",
			"Expected a value matching the resolved structure.",
			"Expected \"value \\\"quoted\\\"\".",
			"Expected a plain object containing only the defined properties.",
			"Expected a plain object matching the record definition.",
			"Expected a value matching the configured type.",
			"Expected a value matching at least one union member.",
		]);
	});

	it("formats default type messages", () => {
		const dictionary = DDataStructure.defaultErrorInterpreterDataStructureDictionary;

		expect([
			dictionary["@DuplojsLangDataStructure/bigint-type"](),
			dictionary["@DuplojsLangDataStructure/bigint-literal-type"](
				DDataStructure.BigintLiteralType(12n),
			),
			dictionary["@DuplojsLangDataStructure/boolean-type"](),
			dictionary["@DuplojsLangDataStructure/boolean-literal-type"](
				DDataStructure.BooleanLiteralType(true),
			),
			dictionary["@DuplojsLangDataStructure/date-type"](),
			dictionary["@DuplojsLangDataStructure/null-type"](),
			dictionary["@DuplojsLangDataStructure/number-type"](),
			dictionary["@DuplojsLangDataStructure/number-literal-type"](
				DDataStructure.NumberLiteralType(12.5),
			),
			dictionary["@DuplojsLangDataStructure/string-type"](),
			dictionary["@DuplojsLangDataStructure/string-literal-type"](
				DDataStructure.StringLiteralType("value \"quoted\""),
			),
			dictionary["@DuplojsLangDataStructure/time-type"](),
			dictionary["@DuplojsLangDataStructure/undefined-type"](),
		]).toStrictEqual([
			"Expected a bigint.",
			"Expected 12n.",
			"Expected a boolean.",
			"Expected true.",
			"Expected a DuploJS date.",
			"Expected null.",
			"Expected a finite number.",
			"Expected 12.5.",
			"Expected a string.",
			"Expected \"value \\\"quoted\\\"\".",
			"Expected a DuploJS time.",
			"Expected undefined.",
		]);
	});

	it("formats default constraint messages", () => {
		const dictionary = DDataStructure.defaultErrorInterpreterDataStructureDictionary;

		expect([
			dictionary["@DuplojsLangDataStructure/absolute-path-constraint"](),
			dictionary["@DuplojsLangDataStructure/allowed-characters-constraint"](
				DDataStructure.allowedCharacters(["a-z", "0-9"]),
			),
			dictionary["@DuplojsLangDataStructure/array-length-equal-constraint"](
				DDataStructure.arrayLengthEqual(3),
			),
			dictionary["@DuplojsLangDataStructure/between-than-constraint"](
				DDataStructure.betweenThan(1, 5),
			),
			dictionary["@DuplojsLangDataStructure/between-than-or-equal-constraint"](
				DDataStructure.betweenThanOrEqual(1, 5),
			),
			dictionary["@DuplojsLangDataStructure/email-constraint"](),
			dictionary["@DuplojsLangDataStructure/even-constraint"](),
			dictionary["@DuplojsLangDataStructure/greater-than-constraint"](
				DDataStructure.greaterThan(1),
			),
			dictionary["@DuplojsLangDataStructure/greater-than-or-equal-constraint"](
				DDataStructure.greaterThanOrEqual(1),
			),
			dictionary["@DuplojsLangDataStructure/integer-constraint"](),
			dictionary["@DuplojsLangDataStructure/less-than-constraint"](DDataStructure.lessThan(5)),
			dictionary["@DuplojsLangDataStructure/less-than-or-equal-constraint"](
				DDataStructure.lessThanOrEqual(5),
			),
			dictionary["@DuplojsLangDataStructure/max-characters-constraint"](
				DDataStructure.maxCharacters(10),
			),
			dictionary["@DuplojsLangDataStructure/max-elements-constraint"](
				DDataStructure.maxElements(10),
			),
			dictionary["@DuplojsLangDataStructure/min-characters-constraint"](
				DDataStructure.minCharacters(3),
			),
			dictionary["@DuplojsLangDataStructure/min-elements-constraint"](
				DDataStructure.minElements(3),
			),
			dictionary["@DuplojsLangDataStructure/multiple-of-constraint"](
				DDataStructure.multipleOf(3),
			),
			dictionary["@DuplojsLangDataStructure/negative-constraint"](),
			dictionary["@DuplojsLangDataStructure/not-empty-constraint"](),
			dictionary["@DuplojsLangDataStructure/not-zero-constraint"](),
			dictionary["@DuplojsLangDataStructure/number-in-string-constraint"](),
			dictionary["@DuplojsLangDataStructure/odd-constraint"](),
			dictionary["@DuplojsLangDataStructure/path-constraint"](),
			dictionary["@DuplojsLangDataStructure/positive-constraint"](),
			dictionary["@DuplojsLangDataStructure/refine-constraint"](),
			dictionary["@DuplojsLangDataStructure/regex-constraint"](DDataStructure.regex(/value/u)),
			dictionary["@DuplojsLangDataStructure/safe-constraint"](),
			dictionary["@DuplojsLangDataStructure/segment-path-constraint"](),
			dictionary["@DuplojsLangDataStructure/strict-negative-constraint"](),
			dictionary["@DuplojsLangDataStructure/strict-positive-constraint"](),
			dictionary["@DuplojsLangDataStructure/string-length-equal-constraint"](
				DDataStructure.stringLengthEqual(3),
			),
			dictionary["@DuplojsLangDataStructure/trimmed-constraint"](),
			dictionary["@DuplojsLangDataStructure/url-constraint"](),
			dictionary["@DuplojsLangDataStructure/uuid-constraint"](),
			dictionary["@DuplojsLangModeling/entity-structure"](),
			dictionary["@DuplojsLangModeling/new-type-structure"](),
			dictionary["@DuplojsLangModeling/tagged-object-structure"](DModeling.TaggedObjectStructure("test", { prop: DDataStructure.string() })),
		]).toStrictEqual([
			"Expected an absolute path.",
			"Expected a string containing only characters from a-z, 0-9.",
			"Expected an array containing exactly 3 elements.",
			"Expected a number greater than 1 and less than 5.",
			"Expected a number greater than or equal to 1 and less than or equal to 5.",
			"Expected a valid email address.",
			"Expected an even number.",
			"Expected a number greater than 1.",
			"Expected a number greater than or equal to 1.",
			"Expected an integer.",
			"Expected a number less than 5.",
			"Expected a number less than or equal to 5.",
			"Expected a string containing at most 10 characters.",
			"Expected an array containing at most 10 elements.",
			"Expected a string containing at least 3 characters.",
			"Expected an array containing at least 3 elements.",
			"Expected a multiple of 3.",
			"Expected a number less than or equal to zero.",
			"Expected a non-empty string.",
			"Expected a non-zero number.",
			"Expected a string representing a number.",
			"Expected an odd number.",
			"Expected a valid path.",
			"Expected a number greater than or equal to zero.",
			"Expected a value satisfying the custom refinement.",
			"Expected a string matching /value/u.",
			"Expected a number strictly between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER.",
			"Expected a valid path segment.",
			"Expected a number less than zero.",
			"Expected a number greater than zero.",
			"Expected a string containing exactly 3 characters.",
			"Expected a string without leading or trailing whitespace.",
			"Expected a valid URL.",
			"Expected a valid UUID.",
			"Expected a valid entity object.",
			"Expected a value matching the branded type.",
			"Expected a plain object matching one of the tagged variants of test.",
		]);
	});
});

describe("defaultErrorInterpreterCodecDictionary", () => {
	it("formats predicate issues for every default codec", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const codecs = [
			DDataStructure.codecsJson.definition.bigint,
			DDataStructure.codecsJson.definition.date,
			DDataStructure.codecsJson.definition.time,
			DDataStructure.codecsString.definition.bigint,
			DDataStructure.codecsString.definition.boolean,
			DDataStructure.codecsString.definition.date,
			DDataStructure.codecsString.definition.null,
			DDataStructure.codecsString.definition.number,
			DDataStructure.codecsString.definition.time,
			DDataStructure.codecsString.definition.undefined,
		];

		codecs.forEach(
			(codec) => void errorHandler.addDecodeIssue(codec, "predicate", "invalid"),
		);

		const interpretedIssues = DDataStructure.createErrorInterpreter(
			{},
			DDataStructure.defaultErrorInterpreterCodecDictionary,
		)(errorHandler.createError());

		type _CheckDictionary = ExpectType<
			DDataStructure.CodecDictionaryParams,
			typeof DDataStructure.defaultErrorInterpreterCodecDictionary,
			"two-extends-one"
		>;

		expect(
			interpretedIssues.map(
				(issue) => issue.interpretedMessage.interpretedSource,
			),
		).toStrictEqual([
			"Expected a string for the JSON bigint codec.",
			"Expected a string for the JSON date codec.",
			"Expected a string for the JSON time codec.",
			"Expected a string for the string bigint codec.",
			"Expected the string \"true\" or \"false\" for the string boolean codec.",
			"Expected a string for the string date codec.",
			"Expected the string \"null\" for the string null codec.",
			"Expected a string representing a number for the string number codec.",
			"Expected a string for the string time codec.",
			"Expected the string \"undefined\" for the string undefined codec.",
		]);
	});

	it("adapts messages to every codec issue origin and direction", () => {
		const codec = DDataStructure.codecsJson.definition.bigint;
		const errorHandler = DDataStructure.createErrorHandler();

		errorHandler.addEncodeIssue(codec, "predicate", "invalid");
		errorHandler.addDecodeIssue(codec, "predicate", "invalid");
		errorHandler.addEncodeIssue(codec, "encoding", 12n);
		errorHandler.addDecodeIssue(codec, "decoding", "invalid");
		errorHandler.addEncodeIssue(codec, "external", 12n);
		errorHandler.addDecodeIssue(codec, "external", "invalid");

		const interpretedIssues = DDataStructure.createErrorInterpreter(
			{},
			DDataStructure.defaultErrorInterpreterCodecDictionary,
		)(errorHandler.createError());

		expect(
			interpretedIssues.map(
				(issue) => issue.interpretedMessage.interpretedSource,
			),
		).toStrictEqual([
			"The JSON bigint codec must produce a string.",
			"Expected a string for the JSON bigint codec.",
			"The JSON bigint codec could not encode a bigint.",
			"The JSON bigint codec could not decode the value as a bigint.",
			"The JSON bigint codec encountered an external error while encoding.",
			"The JSON bigint codec encountered an external error while decoding.",
		]);
	});
});
