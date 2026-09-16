import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
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

				type _CheckArgs = DCommon.ExpectType<
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

	it("reports unexpected arguments when no sub-command matches", async() => {
		setEnvironment("TEST");
		const error = DSCommand.createError("root");
		const child = DSCommand.create("child", () => undefined);
		const root = DSCommand.create("root", { subjects: [child] }, () => undefined);

		await expect(root.execute(["unknown"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.currentPath).toEqual(["root"]);
		expect(error.issues).toEqual([
			expect.objectContaining({
				expect: 0,
				receive: 1,
				path: "root",
			}),
		]);
	});

	it("reports unexpected arguments when the command has no subject", async() => {
		setEnvironment("TEST");
		const error = DSCommand.createError("root");
		const command = DSCommand.create("root", () => undefined);

		await expect(command.execute(["extra", "args"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			expect.objectContaining({
				expect: 0,
				receive: 2,
			}),
		]);
	});

	it("logs help and skips the execute handler", async() => {
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

		await expect(command.execute(["-h"], DSCommand.createError("root"))).resolves.toBeUndefined();

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

	it("returns a command error when the argument count mismatches", async() => {
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

		await expect(command.execute(["only-one"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(executeSpy).not.toHaveBeenCalled();
		expect(error.issues).toEqual([
			expect.objectContaining({
				expect: 2,
				receive: 1,
			}),
		]);
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
