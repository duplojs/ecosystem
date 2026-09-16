import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSCommand, DSDataStructure } from "@scripts";

describe("help", () => {
	it("renders command help without subject or options", () => {
		const command = DSCommand.create("root", () => undefined);

		const help = DSCommand.renderCommandHelp(command, 0).join("\n");

		expect(help).toContain("COMMAND");
		expect(help).toContain("root");
		expect(help).toContain("USAGE");
	});

	it("renders command help with arguments", () => {
		const command = DSCommand.create(
			"root",
			{
				description: "Root command.",
				subjects: [
					DSCommand.createArgument("required", DDataStructure.string(), {
						description: "Required argument.",
					}),
					DSCommand.createArgument("optional", DDataStructure.number(), {
						description: "Optional argument.",
						optional: true,
					}),
				],
			},
			() => undefined,
		);

		const help = DSCommand.renderCommandHelp(command, 0).join("\n");

		expect(help).toContain("Root command.");
		expect(help).toContain("ARGUMENTS");
		expect(help).toContain("required");
		expect(help).toContain("optional");
		expect(help).toContain("Required argument.");
		expect(help).toContain("Optional argument.");
	});

	it("renders command help with sub-commands", () => {
		const childWithDescription = DSCommand.create(
			"serve",
			{ description: "Start server." },
			() => undefined,
		);
		const childWithoutDescription = DSCommand.create("build", () => undefined);
		const command = DSCommand.create(
			"root",
			{ subjects: [childWithDescription, childWithoutDescription] },
			() => undefined,
		);

		const help = DSCommand.renderCommandHelp(command, 0).join("\n");

		expect(help).toContain("COMMANDS");
		expect(help).toContain("serve");
		expect(help).toContain("Start server.");
		expect(help).toContain("build");
		expect(help).toContain("<command>");
	});

	it("renders options help for default option kinds", () => {
		const help = DSCommand.renderOptionsHelp(
			[
				DSCommand.createOption("name", DDataStructure.string(), {
					description: "User name.",
					aliases: ["n"],
					required: true,
				}),
				DSCommand.createArrayOption("ids", DDataStructure.number(), {
					description: "Resource ids.",
					aliases: ["i"],
					min: 1,
					max: 3,
				}),
				DSCommand.createBooleanOption("verbose", {
					description: "Enable verbose logs.",
					aliases: ["v"],
				}),
			],
			0,
		);

		expect(help).toContain("OPTIONS");
		expect(help).toContain("n");
		expect(help).toContain("name");
		expect(help).toContain("<value>");
		expect(help).toContain("User name.");
		expect(help).toContain("i");
		expect(help).toContain("ids");
		expect(help).toContain("<value...>");
		expect(help).toContain("Resource ids.");
		expect(help).toContain("v");
		expect(help).toContain("verbose");
		expect(help).toContain("Enable verbose logs.");
	});

	it("renders fallback option details for unknown option kinds", () => {
		const help = DSCommand.renderOptionsHelp(
			[
				{
					name: "custom",
					description: "Custom option.",
					aliases: [],
				} as never,
			],
			0,
		);

		expect(help).toContain("custom");
		expect(help).toContain("Custom option.");
	});

	it("renders supported data structure types", () => {
		const help = DSCommand.renderArgumentsHelp(
			[
				DSCommand.createArgument("string", DDataStructure.string()),
				DSCommand.createArgument("number", DDataStructure.number()),
				DSCommand.createArgument("bigint", DDataStructure.bigint()),
				DSCommand.createArgument("boolean", DDataStructure.boolean()),
				DSCommand.createArgument("date", DDataStructure.date()),
				DSCommand.createArgument("time", DDataStructure.time()),
				DSCommand.createArgument("file", DSDataStructure.file()),
				DSCommand.createArgument("stringLiteral", DDataStructure.literal("value")),
				DSCommand.createArgument("numberLiteral", DDataStructure.literal(42)),
				DSCommand.createArgument("bigintLiteral", DDataStructure.literal(42n)),
				DSCommand.createArgument("booleanLiteral", DDataStructure.literal(true)),
				DSCommand.createArgument("nullLiteral", DDataStructure.literal(null)),
				DSCommand.createArgument("undefinedLiteral", DDataStructure.literal(undefined)),
			],
			0,
		);

		expect(help).toContain("string");
		expect(help).toContain("number");
		expect(help).toContain("bigint");
		expect(help).toContain("boolean");
		expect(help).toContain("date");
		expect(help).toContain("time");
		expect(help).toContain("file");
		expect(help).toContain("\"value\"");
		expect(help).toContain("42");
		expect(help).toContain("42n");
		expect(help).toContain("true");
		expect(help).toContain("null");
		expect(help).toContain("undefined");
	});

	it("renders string, array and number constraints", () => {
		const help = DSCommand.renderArgumentsHelp(
			[
				DSCommand.createArgument("lengthEqual", DDataStructure.string([DDataStructure.stringLengthEqual(3)])),
				DSCommand.createArgument("lengthRange", DDataStructure.string([DDataStructure.minCharacters(2), DDataStructure.maxCharacters(4)])),
				DSCommand.createArgument("minLength", DDataStructure.string([DDataStructure.minCharacters(2)])),
				DSCommand.createArgument("maxLength", DDataStructure.string([DDataStructure.maxCharacters(4)])),
				DSCommand.createArgument("arrayEqual", DDataStructure.array(DDataStructure.string(), [DDataStructure.arrayLengthEqual(2)]) as never),
				DSCommand.createArgument("arrayRange", DDataStructure.array(DDataStructure.string(), [DDataStructure.minElements(1), DDataStructure.maxElements(3)]) as never),
				DSCommand.createArgument("arrayMin", DDataStructure.array(DDataStructure.string(), [DDataStructure.minElements(1)]) as never),
				DSCommand.createArgument("arrayMax", DDataStructure.array(DDataStructure.string(), [DDataStructure.maxElements(3)]) as never),
				DSCommand.createArgument("arrayItem", DDataStructure.array(DDataStructure.string([DDataStructure.minCharacters(2)])) as never),
				DSCommand.createArgument("greater", DDataStructure.number([DDataStructure.greaterThan(1)])),
				DSCommand.createArgument("greaterEqual", DDataStructure.number([DDataStructure.greaterThanOrEqual(1)])),
				DSCommand.createArgument("less", DDataStructure.number([DDataStructure.lessThan(5)])),
				DSCommand.createArgument("lessEqual", DDataStructure.number([DDataStructure.lessThanOrEqual(5)])),
			],
			0,
		);

		expect(help).toContain("length");
		expect(help).toContain("2..4");
		expect(help).toContain("min length");
		expect(help).toContain("max length");
		expect(help).toContain("items");
		expect(help).toContain("1..3");
		expect(help).toContain("min items");
		expect(help).toContain("max items");
		expect(help).toContain("> ");
		expect(help).toContain("min");
		expect(help).toContain("< ");
		expect(help).toContain("max");
	});

	it("renders simple constraints", () => {
		const help = DSCommand.renderArgumentsHelp(
			[
				DSCommand.createArgument("email", DDataStructure.string([DDataStructure.email()])),
				DSCommand.createArgument("url", DDataStructure.string([DDataStructure.url()])),
				DSCommand.createArgument("uuid", DDataStructure.string([DDataStructure.uuid()])),
				DSCommand.createArgument("integer", DDataStructure.number([DDataStructure.integer()])),
				DSCommand.createArgument("trimmed", DDataStructure.string([DDataStructure.trimmed()])),
				DSCommand.createArgument("notEmpty", DDataStructure.string([DDataStructure.notEmpty()])),
				DSCommand.createArgument("numberInString", DDataStructure.string([DDataStructure.numberInString()])),
				DSCommand.createArgument("even", DDataStructure.number([DDataStructure.even()])),
				DSCommand.createArgument("odd", DDataStructure.number([DDataStructure.odd()])),
				DSCommand.createArgument("positive", DDataStructure.number([DDataStructure.positive()])),
				DSCommand.createArgument("negative", DDataStructure.number([DDataStructure.negative()])),
				DSCommand.createArgument("notZero", DDataStructure.number([DDataStructure.notZero()])),
				DSCommand.createArgument("safe", DDataStructure.number([DDataStructure.safe()])),
				DSCommand.createArgument("path", DDataStructure.string([DDataStructure.path()])),
				DSCommand.createArgument("absolutePath", DDataStructure.string([DDataStructure.absolutePath()])),
				DSCommand.createArgument("segmentPath", DDataStructure.string([DDataStructure.segmentPath()])),
				DSCommand.createArgument("strictPositive", DDataStructure.number([DDataStructure.strictPositive()])),
				DSCommand.createArgument("strictNegative", DDataStructure.number([DDataStructure.strictNegative()])),
				DSCommand.createArgument("between", DDataStructure.number([DDataStructure.betweenThan(1, 5)])),
				DSCommand.createArgument("range", DDataStructure.number([DDataStructure.betweenThanOrEqual(1, 5)])),
				DSCommand.createArgument("multiple", DDataStructure.number([DDataStructure.multipleOf(3)])),
				DSCommand.createArgument("regex", DDataStructure.string([DDataStructure.regex(/^a/)])),
				DSCommand.createArgument("exist", DSDataStructure.file([DSDataStructure.exist()])),
				DSCommand.createArgument("mime", DSDataStructure.file([DSDataStructure.mimeType(/^text\//)])),
			],
			0,
		);

		expect(help).toContain("email");
		expect(help).toContain("url");
		expect(help).toContain("uuid");
		expect(help).toContain("integer");
		expect(help).toContain("trimmed");
		expect(help).toContain("not empty");
		expect(help).toContain("number in string");
		expect(help).toContain("even");
		expect(help).toContain("odd");
		expect(help).toContain("positive");
		expect(help).toContain("negative");
		expect(help).toContain("not zero");
		expect(help).toContain("safe number");
		expect(help).toContain("path");
		expect(help).toContain("absolute path");
		expect(help).toContain("path segment");
		expect(help).toContain("range");
		expect(help).toContain("multiple of");
		expect(help).toContain("pattern");
		expect(help).toContain("exists");
		expect(help).toContain("mime");
	});

	it("renders file size constraints", () => {
		const help = DSCommand.renderArgumentsHelp(
			[
				DSCommand.createArgument("sizeRange", DSDataStructure.file([
					DSDataStructure.size({
						min: 1024,
						max: 2048,
					}),
				])),
				DSCommand.createArgument("sizeMin", DSDataStructure.file([DSDataStructure.size({ min: 1024 })])),
				DSCommand.createArgument("sizeMax", DSDataStructure.file([DSDataStructure.size({ max: 1536 })])),
				DSCommand.createArgument("sizeAny", DSDataStructure.file([DSDataStructure.size({})])),
			],
			0,
		);

		expect(help).toContain("size");
		expect(help).toContain("1 KB..2 KB");
		expect(help).toContain("min size");
		expect(help).toContain("max size");
		expect(help).toContain("1.5 KB");
	});

	it("renders nested and union structures", () => {
		const help = DSCommand.renderArgumentsHelp(
			[
				DSCommand.createArgument("lazy", DDataStructure.lazy(() => DDataStructure.string([DDataStructure.minCharacters(2)]), [DDataStructure.maxCharacters(4)])),
				DSCommand.createArgument("optionalOnly", DDataStructure.union([DDataStructure.undefined()])),
				DSCommand.createArgument("optionalString", DDataStructure.union([DDataStructure.string(), DDataStructure.undefined()])),
				DSCommand.createArgument("stringOrNumber", DDataStructure.union([DDataStructure.string(), DDataStructure.number()])),
			],
			0,
		);

		expect(help).toContain("lazy");
		expect(help).toContain("min length");
		expect(help).toContain("max length");
		expect(help).toContain("undefined");
		expect(help).toContain("string");
		expect(help).toContain("number");
		expect(help).toContain("|");
	});

	it("renders unknown structures and unknown types", () => {
		const unknownStructure = {
			definition: {
				constraints: [],
			},
		};
		const unknownTypeStructure = {
			definition: {
				type: {},
				constraints: [],
			},
			[DDataStructure.typeStructureKind.runTimeKey]: null,
		};

		const help = DSCommand.renderArgumentsHelp(
			[
				DSCommand.createArgument("unknownStructure", unknownStructure as never),
				DSCommand.createArgument("unknownType", unknownTypeStructure as never),
			],
			0,
		);

		expect(help).toContain("unknownStructure");
		expect(help).toContain("unknownType");
		expect(help).toContain("unknown");
	});

	it("logs command and exec option help", () => {
		const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
		const command = DSCommand.create(
			"root",
			{
				options: [DSCommand.createBooleanOption("verbose")],
			},
			() => undefined,
		);

		DSCommand.logCommandHelp(command);
		DSCommand.logExecOptionHelp([DSCommand.createBooleanOption("verbose")]);

		expect(consoleLogSpy).toHaveBeenCalledTimes(2);
		expect(String(consoleLogSpy.mock.calls[0]?.[0])).toContain("COMMAND");
		expect(String(consoleLogSpy.mock.calls[1]?.[0])).toContain("EXEC OPTIONS");
	});
});
