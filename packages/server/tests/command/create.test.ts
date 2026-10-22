import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DSCommand, TESTImplementation, setEnvironment } from "@scripts";

describe("create", () => {
	afterEach(() => {
		setEnvironment("NODE");
		TESTImplementation.clear();
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it("identifies command tuples", () => {
		const command = DSCommand.create("child", () => undefined);
		const argument = DSCommand.createArgument("id", DDataStructure.string());

		expect(DSCommand.isCommands([command])).toBe(true);
		expect(DSCommand.isCommands([argument])).toBe(false);
		expect(DSCommand.isCommands("command")).toBe(false);
	});

	it("creates a command without params", () => {
		const command = DSCommand.create("root", () => undefined);

		type _CheckCommand = DCommon.ExpectType<
			typeof command,
			DSCommand.Command<"root">,
			"strict"
		>;

		expect(command.name).toBe("root");
		expect(command.description).toBeNull();
		expect(command.options).toEqual([]);
		expect(command.subject).toBeNull();
	});

	it("creates a command with options and argument subjects", () => {
		const verbose = DSCommand.createBooleanOption("verbose", {
			description: "Enable verbose logs.",
			aliases: ["v"],
		});
		const id = DSCommand.createArgument(
			"id",
			DDataStructure.number(),
			{ description: "Resource id." },
		);

		const command = DSCommand.create(
			"read",
			{
				description: "Read a resource.",
				options: [verbose],
				subjects: [id],
			},
			() => undefined,
		);

		expect(command.description).toBe("Read a resource.");
		expect(command.options).toEqual([verbose]);
		expect(command.subject).toEqual({
			type: "argument",
			args: [id],
		});
	});

	it("creates a command with sub-command subjects", () => {
		const child = DSCommand.create("child", () => undefined);

		const command = DSCommand.create(
			"root",
			{ subjects: [child] },
			() => undefined,
		);

		expect(command.subject).toEqual({
			type: "subCommand",
			subCommands: [child],
		});
	});

	it("executes a command without params", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const command = DSCommand.create("root", executeSpy);
		const error = DSCommand.createError("root");

		await expect(command.execute([], error)).resolves.toBeUndefined();

		expect(executeSpy).toHaveBeenCalledTimes(1);
		expect(error.issues).toEqual([]);
	});

	it("executes with parsed options and arguments", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();

		const command = DSCommand.create(
			"root",
			{
				options: [
					DSCommand.createBooleanOption("verbose"),
					DSCommand.createOption("name", DDataStructure.string(), { required: true }),
				],
				subjects: [
					DSCommand.createArgument("id", DDataStructure.number()),
					DSCommand.createArgument("tag", DDataStructure.string(), { optional: true }),
				],
			},
			({ options, args }) => {
				type _CheckOptions = DCommon.ExpectType<
					typeof options,
					{
						readonly verbose: boolean;
						readonly name: string;
					},
					"strict"
				>;

				type _CheckArguments = DCommon.ExpectType<
					typeof args,
					{
						readonly id: number;
						readonly tag: string | undefined;
					},
					"strict"
				>;

				executeSpy({
					options,
					args,
				});
			},
		);

		await expect(
			command.execute(["--verbose", "--name", "duplo", "42", "release"], DSCommand.createError("root")),
		).resolves.toBeUndefined();

		expect(executeSpy).toHaveBeenCalledWith({
			options: {
				verbose: true,
				name: "duplo",
			},
			args: {
				id: 42,
				tag: "release",
			},
		});
	});

	it.each([
		{
			args: ["--verbose", "app", "dist"],
			verbose: true,
		},
		{
			args: ["app", "--verbose", "dist"],
			verbose: true,
		},
		{
			args: ["app", "dist", "--verbose"],
			verbose: true,
		},
		{
			args: ["-v", "app", "dist"],
			verbose: true,
		},
		{
			args: ["app", "-v", "dist"],
			verbose: true,
		},
		{
			args: ["app", "dist"],
			verbose: false,
		},
	])("preserves positional arguments around boolean flags in $args", async({ args, verbose }) => {
		const executeSpy = vi.fn();
		const error = DSCommand.createError("cli");
		const build = DSCommand.create("build", {
			options: [DSCommand.createBooleanOption("verbose", { aliases: ["v"] })],
			subjects: [
				DSCommand.createArgument("target", DDataStructure.string()),
				DSCommand.createArgument("destination", DDataStructure.string()),
			],
		}, executeSpy);
		const command = DSCommand.create("cli", { subjects: [build] }, vi.fn());

		await expect(command.execute(["build", ...args], error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(error.currentPath).toEqual(["cli", "build"]);
		expect(executeSpy).toHaveBeenCalledExactlyOnceWith({
			options: { verbose },
			args: {
				target: "app",
				destination: "dist",
			},
		});
	});

	it.each([
		{ args: ["--verbose", "app", "--output", "dist", "--tags", "alpha,beta"] },
		{ args: ["-v", "app", "-o=dist", "-t=alpha,beta"] },
		{ args: ["--tags=alpha,beta", "--output=dist", "--verbose", "app"] },
	])("combines boolean, simple and array options with positional arguments in $args", async({ args }) => {
		const executeSpy = vi.fn();
		const error = DSCommand.createError("build");
		const command = DSCommand.create("build", {
			options: [
				DSCommand.createBooleanOption("verbose", { aliases: ["v"] }),
				DSCommand.createOption("output", DDataStructure.string(), {
					aliases: ["o"],
					required: true,
				}),
				DSCommand.createArrayOption("tags", DDataStructure.string(), {
					aliases: ["t"],
					required: true,
				}),
			],
			subjects: [DSCommand.createArgument("target", DDataStructure.string())],
		}, executeSpy);

		await expect(command.execute(args, error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(executeSpy).toHaveBeenCalledExactlyOnceWith({
			options: {
				verbose: true,
				output: "dist",
				tags: ["alpha", "beta"],
			},
			args: { target: "app" },
		});
	});

	it.each([
		{ input: ["--verbose", "--count", "-7", "-42"] },
		{ input: ["--verbose", "-42", "--count", "-7"] },
		{ input: ["-42", "--count", "-7", "--verbose"] },
		{ input: ["-v", "-42", "-c", "-7"] },
		{ input: ["--count=-7", "--verbose", "-42"] },
	])("parses negative option values and positional arguments in $input", async({ input }) => {
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create("root", {
			options: [
				DSCommand.createBooleanOption("verbose", { aliases: ["v"] }),
				DSCommand.createOption("count", DDataStructure.number(), {
					aliases: ["c"],
					required: true,
				}),
			],
			subjects: [DSCommand.createArgument("offset", DDataStructure.number())],
		}, ({ options, args }) => {
			type _CheckOptions = DCommon.ExpectType<
				typeof options,
				{
					readonly verbose: boolean;
					readonly count: number;
				},
				"strict"
			>;

			type _CheckArguments = DCommon.ExpectType<
				typeof args,
				{ readonly offset: number },
				"strict"
			>;

			executeSpy({
				options,
				args,
			});
		});

		const result = await command.execute(input, error);

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
		expect(executeSpy).toHaveBeenCalledExactlyOnceWith({
			options: {
				verbose: true,
				count: -7,
			},
			args: { offset: -42 },
		});
	});

	it("reports unknown options remaining after a boolean flag", async() => {
		const executeSpy = vi.fn();
		const error = DSCommand.createError("build");
		const command = DSCommand.create("build", {
			options: [DSCommand.createBooleanOption("verbose")],
			subjects: [DSCommand.createArgument("target", DDataStructure.string())],
		}, executeSpy);

		await expect(command.execute(["--verbose", "app", "--other"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			DModeling.taggedObject("UnknownOptionIssue", {
				optionTokens: ["--other"],
				path: "build",
			}),
		]);
		expect(executeSpy).not.toHaveBeenCalled();
	});

	it("executes when its optional argument is omitted", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create(
			"root",
			{
				subjects: [DSCommand.createArgument("tag", DDataStructure.string(), { optional: true })],
			},
			({ args }) => {
				type _CheckArguments = DCommon.ExpectType<
					typeof args,
					{ readonly tag: string | undefined },
					"strict"
				>;

				executeSpy(args);
			},
		);

		const result = await command.execute([], error);

		expect(error.issues).toEqual([]);
		expect(result).toBeUndefined();
		expect(executeSpy).toHaveBeenCalledExactlyOnceWith({ tag: undefined });
	});

	it("executes with empty params and exposes no typed execute params", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();

		const command = DSCommand.create(
			"root",
			{},
			(params) => {
				type _CheckParams = DCommon.ExpectType<
					typeof params,
					{},
					"strict"
				>;

				executeSpy(params);
			},
		);

		await expect(command.execute([], DSCommand.createError("root"))).resolves.toBeUndefined();

		expect(executeSpy).toHaveBeenCalledWith({
			options: {},
		});
	});

	it("executes the matching sub-command with shifted arguments and path", async() => {
		setEnvironment("TEST");
		const childSpy = vi.fn();
		const rootSpy = vi.fn();
		const error = DSCommand.createError("root");

		const child = DSCommand.create(
			"child",
			{
				subjects: [DSCommand.createArgument("id", DDataStructure.number())],
			},
			({ args }) => childSpy(args),
		);
		const root = DSCommand.create("root", { subjects: [child] }, () => rootSpy());

		await expect(root.execute(["child", "42"], error)).resolves.toBeUndefined();

		expect(childSpy).toHaveBeenCalledWith({ id: 42 });
		expect(rootSpy).not.toHaveBeenCalled();
		expect(error.currentPath).toEqual(["root", "child"]);
		expect(error.issues).toEqual([]);
	});

	it("reports an unknown sub-command when no sub-command matches", async() => {
		setEnvironment("TEST");
		const error = DSCommand.createError("root");
		const child = DSCommand.create("child", () => undefined);
		const root = DSCommand.create("root", { subjects: [child] }, () => undefined);

		await expect(root.execute(["unknown"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.currentPath).toEqual(["root"]);
		expect(error.issues).toEqual([
			DModeling.taggedObject("UnknownSubCommandIssue", {
				subCommandName: "unknown",
				path: "root",
			}),
		]);
	});

	it.each([
		{
			args: ["--prot"],
			optionTokens: ["--prot"],
		},
		{
			args: ["--prot", "80", "--hots=localhost", "-x"],
			optionTokens: ["--prot", "--hots=localhost", "-x"],
		},
	])("reports unknown options in $args", async({ args, optionTokens }) => {
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create("root", {
			options: [DSCommand.createOption("port", DDataStructure.number())],
		}, executeSpy);

		await expect(command.execute(args, error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			DModeling.taggedObject("UnknownOptionIssue", {
				optionTokens,
				path: "root",
			}),
		]);
		expect(executeSpy).not.toHaveBeenCalled();
	});

	it.each([
		{
			args: ["--prot"],
			optionTokens: ["--prot"],
		},
		{
			args: ["42", "--prot"],
			optionTokens: ["--prot"],
		},
		{
			args: ["--prot", "42", "--hots=localhost"],
			optionTokens: ["--prot", "--hots=localhost"],
		},
	])("reports unknown options before parsing positional arguments in $args", async({ args, optionTokens }) => {
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const argument = DSCommand.createArgument("id", DDataStructure.number());
		const argumentSpy = vi.spyOn(argument, "execute");
		const command = DSCommand.create("root", { subjects: [argument] }, executeSpy);

		await expect(command.execute(args, error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			DModeling.taggedObject("UnknownOptionIssue", {
				optionTokens,
				path: "root",
			}),
		]);
		expect(argumentSpy).not.toHaveBeenCalled();
		expect(executeSpy).not.toHaveBeenCalled();
	});

	it.each([
		{ args: ["--port=80", "42"] },
		{ args: ["-p", "80", "42"] },
		{ args: ["42", "--port", "80"] },
	])("preserves recognized options and aliases in $args", async({ args }) => {
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create("root", {
			options: [DSCommand.createOption("port", DDataStructure.number(), { aliases: ["p"] })],
			subjects: [DSCommand.createArgument("id", DDataStructure.number())],
		}, executeSpy);

		await expect(command.execute(args, error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(executeSpy).toHaveBeenCalledExactlyOnceWith({
			options: { port: 80 },
			args: { id: 42 },
		});
	});

	it.each([
		{
			args: ["chlid"],
			subCommandName: "chlid",
			path: "root",
		},
		{
			args: ["child", "garndchild"],
			subCommandName: "garndchild",
			path: "root.child",
		},
		{
			args: ["child", "grandchild", "laef"],
			subCommandName: "laef",
			path: "root.child.grandchild",
		},
		{
			args: ["prefix", "child"],
			subCommandName: "prefix",
			path: "root",
		},
		{
			args: ["--port=80", "child"],
			subCommandName: "child",
			path: "root",
		},
	])("reports the unknown sub-command at its hierarchy level in $args", async({ args, subCommandName, path }) => {
		const executeSpy = vi.fn();
		const leaf = DSCommand.create("leaf", executeSpy);
		const grandchild = DSCommand.create("grandchild", { subjects: [leaf] }, executeSpy);
		const child = DSCommand.create("child", { subjects: [grandchild] }, executeSpy);
		const root = DSCommand.create("root", {
			options: [DSCommand.createOption("port", DDataStructure.number())],
			subjects: [child],
		}, executeSpy);
		const error = DSCommand.createError("root");

		await expect(root.execute(args, error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			DModeling.taggedObject("UnknownSubCommandIssue", {
				subCommandName,
				path,
			}),
		]);
		expect(executeSpy).not.toHaveBeenCalled();
	});

	it.each([
		{
			args: ["--prot"],
			path: "root",
		},
		{
			args: ["child", "--prot"],
			path: "root.child",
		},
	])("reports unknown options on commands with sub-commands in $args", async({ args, path }) => {
		const executeSpy = vi.fn();
		const leaf = DSCommand.create("leaf", executeSpy);
		const child = DSCommand.create("child", { subjects: [leaf] }, executeSpy);
		const root = DSCommand.create("root", { subjects: [child] }, executeSpy);
		const error = DSCommand.createError("root");

		await expect(root.execute(args, error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			DModeling.taggedObject("UnknownOptionIssue", {
				optionTokens: ["--prot"],
				path,
			}),
		]);
		expect(executeSpy).not.toHaveBeenCalled();
	});

	it.each([
		{
			args: [],
			path: ["root"],
		},
		{
			args: ["child"],
			path: ["root", "child"],
		},
		{
			args: ["child", "grandchild"],
			path: ["root", "child", "grandchild"],
		},
		{
			args: ["child", "grandchild", "leaf"],
			path: ["root", "child", "grandchild", "leaf"],
		},
	])("executes valid sub-commands and parents without a sub-command in $args", async({ args, path }) => {
		const executeSpy = vi.fn();
		const leaf = DSCommand.create("leaf", executeSpy);
		const grandchild = DSCommand.create("grandchild", { subjects: [leaf] }, executeSpy);
		const child = DSCommand.create("child", { subjects: [grandchild] }, executeSpy);
		const root = DSCommand.create("root", { subjects: [child] }, executeSpy);
		const error = DSCommand.createError("root");

		await expect(root.execute(args, error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(error.currentPath).toEqual(path);
		expect(executeSpy).toHaveBeenCalledExactlyOnceWith({ options: {} });
	});

	it("reports unexpected arguments when the command has no subject", async() => {
		setEnvironment("TEST");
		const error = DSCommand.createError("root");
		const command = DSCommand.create("root", () => undefined);

		await expect(command.execute(["extra", "args"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			DModeling.taggedObject("TooMuchCommandArgumentIssue", {
				expect: 0,
				receive: 2,
				path: "root",
			}),
		]);
	});

	it.each([
		{ args: ["-h"] },
		{ args: ["--help"] },
		{ args: ["--help", "app"] },
		{ args: ["-h", "app"] },
		{ args: ["--prot", "--help"] },
	])("logs help and skips the execute handler with $args", async({ args }) => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

		const command = DSCommand.create(
			"root",
			{
				description: "Root command.",
				options: [DSCommand.createBooleanOption("verbose")],
				subjects: [DSCommand.createArgument("name", DDataStructure.string())],
			},
			executeSpy,
		);

		const error = DSCommand.createError("root");

		await expect(command.execute(args, error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(executeSpy).not.toHaveBeenCalled();
		expect(consoleLogSpy).toHaveBeenCalledTimes(1);
		expect(String(consoleLogSpy.mock.calls[0]?.[0])).toContain("Root command.");
		expect(String(consoleLogSpy.mock.calls[0]?.[0])).toContain("verbose");
	});

	it("returns a command error when the help option is malformed", async() => {
		setEnvironment("TEST");
		const error = DSCommand.createError("root");
		const command = DSCommand.create("root", () => undefined);

		await expect(command.execute(["--help=true"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "help",
				data: "true",
				path: "root",
			}),
		]);
	});

	it("returns a command error when an option fails", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create(
			"root",
			{
				options: [DSCommand.createOption("name", DDataStructure.string(), { required: true })],
			},
			executeSpy,
		);

		await expect(command.execute([], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(executeSpy).not.toHaveBeenCalled();
		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "name",
				path: "root",
			}),
		]);
	});

	it("collects all missing required options before returning a command error", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create("root", {
			options: [
				DSCommand.createOption("name", DDataStructure.string(), { required: true }),
				DSCommand.createOption("count", DDataStructure.number(), { required: true }),
				DSCommand.createArrayOption("ids", DDataStructure.number(), { required: true }),
			],
		}, executeSpy);

		const result = await command.execute([], error);

		type _CheckResult = DCommon.ExpectType<typeof result, undefined | DSCommand.SymbolCommandError, "strict">;

		expect(result).toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "name",
				data: undefined,
				path: "root",
			}),
			expect.objectContaining({
				optionName: "count",
				data: undefined,
				path: "root",
			}),
			expect.objectContaining({
				optionName: "ids",
				data: undefined,
				path: "root",
			}),
		]);
		expect(executeSpy).not.toHaveBeenCalled();
	});

	it("collects mixed option errors across successful options and skips arguments and the handler", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const verbose = DSCommand.createBooleanOption("verbose");
		const quiet = DSCommand.createBooleanOption("quiet");
		const argument = DSCommand.createArgument("target", DDataStructure.number());
		const verboseSpy = vi.spyOn(verbose, "execute");
		const quietSpy = vi.spyOn(quiet, "execute");
		const argumentSpy = vi.spyOn(argument, "execute");
		const command = DSCommand.create("root", {
			options: [
				DSCommand.createOption("count", DDataStructure.number()),
				verbose,
				DSCommand.createOption("name", DDataStructure.string(), { required: true }),
				DSCommand.createArrayOption("ids", DDataStructure.number()),
				DSCommand.createOption("title", DDataStructure.string()),
				quiet,
			],
			subjects: [argument],
		}, executeSpy);
		const args = ["--count", "bad", "--verbose", "--ids", "1,bad", "--title", "--quiet"];

		await expect(command.execute(args, error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "count",
				data: "bad",
				path: "root",
				dataStructureError: expect.any(Object),
			}),
			expect.objectContaining({
				optionName: "name",
				data: undefined,
				path: "root",
			}),
			expect.objectContaining({
				optionName: "ids",
				data: "1,bad",
				path: "root",
				dataStructureError: expect.any(Object),
			}),
			expect.objectContaining({
				optionName: "title",
				data: undefined,
				path: "root",
			}),
		]);
		expect(verboseSpy).toHaveBeenCalledExactlyOnceWith(args, error);
		expect(quietSpy).toHaveBeenCalledExactlyOnceWith(["--count", "bad", "--ids", "1,bad", "--title", "--quiet"], error);
		expect(argumentSpy).not.toHaveBeenCalled();
		expect(executeSpy).not.toHaveBeenCalled();
	});

	it.each([
		{
			scenario: "a required argument is missing",
			args: ["only-one"],
			issue: DModeling.taggedObject("RequiredArgumentIssue", {
				argumentName: "second",
				data: undefined,
				path: "root",
			}),
		},
		{
			scenario: "too many arguments are provided",
			args: ["first", "second", "extra"],
			issue: DModeling.taggedObject("TooMuchCommandArgumentIssue", {
				expect: 2,
				receive: 3,
				path: "root",
			}),
		},
	])("returns a command error when $scenario", async({ args, issue }) => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create(
			"root",
			{
				subjects: [
					DSCommand.createArgument("first", DDataStructure.string()),
					DSCommand.createArgument("second", DDataStructure.string()),
				],
			},
			executeSpy,
		);

		await expect(command.execute(args, error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(executeSpy).not.toHaveBeenCalled();
		expect(error.issues).toEqual([issue]);
	});

	it("returns a command error when an argument fails", async() => {
		setEnvironment("TEST");
		const executeSpy = vi.fn();
		const error = DSCommand.createError("root");
		const command = DSCommand.create(
			"root",
			{
				subjects: [DSCommand.createArgument("id", DDataStructure.number())],
			},
			executeSpy,
		);

		await expect(command.execute(["bad-id"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(executeSpy).not.toHaveBeenCalled();
		expect(error.issues).toEqual([
			expect.objectContaining({
				argumentName: "id",
				data: "bad-id",
				path: "root",
			}),
		]);
	});

	it("does not catch execution errors", async() => {
		setEnvironment("TEST");
		const userError = new Error("user crash");
		const command = DSCommand.create("root", () => {
			throw userError;
		});

		await expect(command.execute([], DSCommand.createError("root"))).rejects.toThrow(userError);
	});

	it("forbids duplicate option names", () => {
		DSCommand.create(
			"root",
			{
				// @ts-expect-error duplicate option name must be rejected
				options: [
					DSCommand.createOption("same", DDataStructure.string()),
					DSCommand.createBooleanOption("same"),
				],
			},
			() => undefined,
		);
	});

	it("forbids duplicate subject names", () => {
		DSCommand.create(
			"root",
			{
				// @ts-expect-error duplicate argument name must be rejected
				subjects: [
					DSCommand.createArgument("id", DDataStructure.number()),
					DSCommand.createArgument("id", DDataStructure.string()),
				],
			},
			() => undefined,
		);
	});

	it("forbids optional arguments before required arguments", () => {
		DSCommand.create(
			"root",
			{
				// @ts-expect-error optional argument cannot be declared before a required argument
				subjects: [
					DSCommand.createArgument("maybe", DDataStructure.string(), { optional: true }),
					DSCommand.createArgument("required", DDataStructure.string()),
				],
			},
			() => undefined,
		);
	});

	it("does not expose sub-commands as execute arguments", () => {
		DSCommand.create(
			"root",
			{
				subjects: [DSCommand.create("child", () => undefined)],
			},
			(params) => {
				type _CheckParams = DCommon.ExpectType<
					typeof params,
					{},
					"strict"
				>;
			},
		);
	});
});
