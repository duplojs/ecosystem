import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DServerCommand, TESTImplementation, setEnvironment } from "@duplojs/server";

const escapeCode = String.fromCharCode(27);
const ansiEscapeCodePattern = new RegExp(`${escapeCode}\\[[0-9;]*m`, "g");

void describe("command feature on node", () => {
	afterEach(() => {
		setEnvironment("NODE");
		TESTImplementation.clear();
		mock.reset();
	});

	void it("executes a command with options and arguments", async() => {
		setEnvironment("TEST");
		TESTImplementation.set("getProcessArguments", mock.fn(() => ["build", "--verbose", "--count", "3", "--tags", "api,http"]));

		const executeSpy = mock.fn();
		const result = await DServerCommand.exec(
			{
				displayName: "tool",
				options: [
					DServerCommand.createBooleanOption("verbose"),
					DServerCommand.createOption("count", DDataStructure.number(), { required: true }),
					DServerCommand.createArrayOption("tags", DDataStructure.string()),
				],
				subjects: [DServerCommand.createArgument("task", DDataStructure.string())],
			},
			executeSpy,
		);

		assert.equal(DEither.isRight(result), true);
		assert.deepEqual(executeSpy.mock.calls[0]?.arguments, [
			{
				options: {
					verbose: true,
					count: 3,
					tags: ["api", "http"],
				},
				args: {
					task: "build",
				},
			},
		]);
	});

	void it("routes to a sub command", async() => {
		const rootSpy = mock.fn();
		const deploySpy = mock.fn();
		const error = DServerCommand.createError("tool");
		const command = DServerCommand.create(
			"tool",
			{
				subjects: [
					DServerCommand.create(
						"deploy",
						{
							options: [DServerCommand.createBooleanOption("dry-run")],
							subjects: [DServerCommand.createArgument("target", DDataStructure.string())],
						},
						deploySpy,
					),
				],
			},
			rootSpy,
		);

		assert.equal(await command.execute(["deploy", "production", "--dry-run"], error), undefined);

		assert.equal(rootSpy.mock.callCount(), 0);
		assert.deepEqual(deploySpy.mock.calls[0]?.arguments, [
			{
				options: { "dry-run": true },
				args: { target: "production" },
			},
		]);
		assert.deepEqual(error.issues, []);
	});

	void it("returns a command error from exec", async() => {
		setEnvironment("TEST");
		TESTImplementation.set("getProcessArguments", mock.fn(() => ["wrong"]));
		const consoleErrorSpy = mock.method(console, "error", () => undefined);
		const executeSpy = mock.fn();

		const result = await DServerCommand.exec(
			{
				displayName: "read",
				subjects: [DServerCommand.createArgument("id", DDataStructure.number())],
			},
			executeSpy,
		);

		DCommon.asserts(result, DEither.isLeft);

		assert.equal(executeSpy.mock.callCount(), 0);
		const issues = DEither.unwrapLeft(result).issues;
		assert.equal(issues.length, 1);
		assert.partialDeepStrictEqual(issues[0], {
			argumentName: "id",
			data: "wrong",
			path: "read",
		});
		assert.equal(
			String(consoleErrorSpy.mock.calls[0]?.arguments[0])
				.replace(ansiEscapeCodePattern, ""),
			[
				"Command failed\tCOMMAND: read",
				"\tARGUMENT: --id",
				"\t↳ <value> : Expected a string representing a number for the string number codec.",
			].join("\n"),
		);
	});

	void it("prints command help without executing the command", async() => {
		setEnvironment("TEST");
		TESTImplementation.set("getProcessArguments", mock.fn(() => ["--help"]));
		const consoleLogSpy = mock.method(console, "log", () => undefined);
		const executeSpy = mock.fn();

		const result = await DServerCommand.exec(
			{
				displayName: "cli",
				description: "Integration command.",
				options: [
					DServerCommand.createBooleanOption("verbose", {
						description: "Print detailed logs.",
						aliases: ["v"],
					}),
					DServerCommand.createOption(
						"count",
						DDataStructure.number([DDataStructure.integer(), DDataStructure.greaterThanOrEqual(1)]),
						{
							description: "Number of executions.",
							required: true,
						},
					),
					DServerCommand.createArrayOption(
						"tags",
						DDataStructure.string([DDataStructure.minCharacters(2)]),
						{
							description: "Execution tags.",
							aliases: ["t"],
							min: 1,
							max: 3,
						},
					),
				],
				subjects: [
					DServerCommand.createArgument(
						"target",
						DDataStructure.string([DDataStructure.notEmpty()]),
						{ description: "Deployment target." },
					),
				],
			},
			executeSpy,
		);

		assert.equal(DEither.isRight(result), true);
		assert.equal(executeSpy.mock.callCount(), 0);
		assert.equal(
			String(consoleLogSpy.mock.calls[0]?.arguments[0])
				.replace(ansiEscapeCodePattern, ""),
			[
				"COMMAND  cli",
				"\tIntegration command.",
				"USAGE",
				"\tcli <target> [options]",
				"ARGUMENTS",
				"\ttarget      string · required",
				"\t\tDeployment target.",
				"\t\t↳ not empty",
				"OPTIONS",
				"\t-v, --verbose",
				"\t\tboolean",
				"\t\tPrint detailed logs.",
				"\t--count <value>",
				"\t\tnumber · required",
				"\t\tNumber of executions.",
				"\t\t↳ min 1",
				"\t\t↳ integer",
				"\t-t, --tags <value...>",
				"\t\tstring[] · optional",
				"\t\tExecution tags.",
				"\t\t↳ item min length 2",
				"\t\t↳ items 1..3",
			].join("\n"),
		);
	});
});
