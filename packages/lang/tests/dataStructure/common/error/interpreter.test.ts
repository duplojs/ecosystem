import { DDataStructure, type ExpectType } from "@scripts";

describe("createErrorInterpreter", () => {
	it("interprets structure, type, constraint and codec issues", () => {
		const stringType = DDataStructure.StringType()
			.addMessage("Expected string type");
		const minCharactersConstraint = DDataStructure.minCharacters(3)
			.addMessage("Expected at least three characters");
		const structure = DDataStructure.TypeStructure(
			stringType,
			[minCharactersConstraint],
		).addMessage("Expected string structure");
		const codec = DDataStructure.createCodec(
			DDataStructure.TheString,
			DDataStructure.TypeStructure(DDataStructure.NumberType(), []).is,
			(data) => data.length,
			(data) => `value-${data}`,
		);
		const unmatchedCodec = DDataStructure.createCodec(
			DDataStructure.TheNumber,
			DDataStructure.TypeStructure(DDataStructure.StringType(), []).is,
			(data) => String(data),
			(data) => Number(data),
		);
		const errorHandler = DDataStructure.createErrorHandler();
		const interpret = DDataStructure.createErrorInterpreter(
			{
				"@DuplojsLangDataStructure/string-type": (source, issue) => {
					type _CheckSource = ExpectType<
						typeof source,
						DDataStructure.StringType,
						"strict"
					>;
					type _CheckIssue = ExpectType<
						typeof issue,
						DDataStructure.Issue,
						"strict"
					>;

					return `Global ${source.definition.message} for ${typeof issue.data}`;
				},
				"@DuplojsLangDataStructure/type-structure": (source, issue) => {
					type _CheckSource = ExpectType<
						typeof source,
						DDataStructure.TypeStructure,
						"strict"
					>;
					type _CheckIssue = ExpectType<
						typeof issue,
						DDataStructure.Issue,
						"strict"
					>;

					return `Global ${source.definition.message} for ${typeof issue.data}`;
				},
				"@DuplojsLangDataStructure/min-characters-constraint": (source, issue) => {
					type _CheckSource = ExpectType<
						typeof source,
						DDataStructure.MinCharactersConstraint,
						"strict"
					>;
					type _CheckIssue = ExpectType<
						typeof issue,
						DDataStructure.Issue,
						"strict"
					>;

					return `Global min ${source.definition.min} for ${typeof issue.data}`;
				},
			},
			[
				[
					codec,
					(source, issue) => {
						type _CheckSource = ExpectType<
							typeof source,
							DDataStructure.Codec,
							"strict"
						>;
						type _CheckIssue = ExpectType<
							typeof issue,
							DDataStructure.EncodeIssue | DDataStructure.DecodeIssue,
							"strict"
						>;

						return `Global codec ${issue.from}`;
					},
				],
			],
		);

		errorHandler.addIssue(structure, 123, stringType);
		errorHandler.addIssue(structure, "ab", minCharactersConstraint);
		errorHandler.addEncodeIssue(codec, "external", "encode-data", "Encode message");
		errorHandler.addDecodeIssue(unmatchedCodec, "external", "decode-data", "Decode message");

		const interpretedIssues = interpret(errorHandler.createError());

		type _CheckInterpretedIssues = ExpectType<
			typeof interpretedIssues,
			readonly DDataStructure.InterpretedIssues[],
			"strict"
		>;

		expect(interpretedIssues).toHaveLength(4);
		expect(interpretedIssues[0]).toMatchObject({
			data: 123,
			interpretedMessage: {
				source: "Expected string structure",
				subSource: "Expected string type",
				interpretedSource: "Global Expected string structure for number",
				interpretedSubSource: "Global Expected string type for number",
			},
			path: "",
		});
		expect(interpretedIssues[0]?.getSource()).toBe(structure);
		expect(interpretedIssues[1]).toMatchObject({
			data: "ab",
			interpretedMessage: {
				source: "Expected string structure",
				subSource: "Expected at least three characters",
				interpretedSource: "Global Expected string structure for string",
				interpretedSubSource: "Global min 3 for string",
			},
			path: "",
		});
		expect(interpretedIssues[1]?.getSource()).toBe(structure);
		expect(interpretedIssues[2]).toMatchObject({
			data: "encode-data",
			from: "external",
			interpretedMessage: {
				source: "Encode message",
				interpretedSource: "Global codec external",
			},
			path: "",
		});
		expect(interpretedIssues[2]?.getSource()).toBe(codec);
		expect(interpretedIssues[3]).toMatchObject({
			data: "decode-data",
			from: "external",
			interpretedMessage: {
				source: "Decode message",
				interpretedSource: undefined,
			},
			path: "",
		});
		expect(interpretedIssues[3]?.getSource()).toBe(unmatchedCodec);
	});

	it("keeps interpreted messages undefined without matching dictionaries", () => {
		const structure = DDataStructure.number();
		const errorHandler = DDataStructure.createErrorHandler();
		const interpret = DDataStructure.createErrorInterpreter();

		errorHandler.addIssue(structure, "not-a-number");

		const interpretedIssues = interpret(errorHandler.createError());

		expect(interpretedIssues[0]?.interpretedMessage).toStrictEqual({
			source: undefined,
			subSource: undefined,
			interpretedSource: undefined,
			interpretedSubSource: undefined,
		});
	});
});
