import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DServerCommand, TESTImplementation, setEnvironment } from "@duplojs/server";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

const initialConsoleLog = console.log;
const initialConsoleError = console.error;
let consoleLogOutput = "";
let consoleErrorOutput = "";

void describe("command feature on deno", () => {
	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.clear();
		consoleLogOutput = "";
		consoleErrorOutput = "";
		console.log = (...args: unknown[]) => {
			consoleLogOutput = args.map(String).join(" ");
		};
		console.error = (...args: unknown[]) => {
			consoleErrorOutput = args.map(String).join(" ");
		};
	});

	afterEach(() => {
		setEnvironment("NODE");
		TESTImplementation.clear();
		console.log = initialConsoleLog;
		console.error = initialConsoleError;
	});

	void it("executes a command with options and arguments", async() => {
		TESTImplementation.set("getProcessArguments", () => ["build", "--verbose", "--count", "3", "--tags", "api,http"]);

		let executeParams: unknown = undefined;
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
			(params) => {
				executeParams = params;
			},
		);

		assert.equal(DEither.isRight(result), true);
		assert.deepEqual(executeParams, {
			options: {
				verbose: true,
				count: 3,
				tags: ["api", "http"],
			},
			args: {
				task: "build",
			},
		});
	});

	void it("routes to a sub command", async() => {
		let rootCalled = false;
		let deployParams: unknown = undefined;
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
						(params) => {
							deployParams = params;
						},
					),
				],
			},
			() => {
				rootCalled = true;
			},
		);

		const result = await command.execute(["deploy", "production", "--dry-run"], error);

		assert.equal(result, undefined);
		assert.equal(rootCalled, false);
		assert.deepEqual(deployParams, {
			options: { "dry-run": true },
			args: { target: "production" },
		});
		assert.deepEqual(error.issues, []);
	});

	void it("returns a command error from exec", async() => {
		TESTImplementation.set("getProcessArguments", () => ["wrong"]);
		let executeCalled = false;

		const result = await DServerCommand.exec(
			{
				displayName: "read",
				subjects: [DServerCommand.createArgument("id", DDataStructure.number())],
			},
			() => {
				executeCalled = true;
			},
		);

		DCommon.asserts(result, DEither.isLeft);

		assert.equal(executeCalled, false);
		assert.equal(DEither.unwrapLeft(result).issues.length, 1);
		assert.equal(consoleErrorOutput.includes("Command failed"), true);
		assert.equal(consoleErrorOutput.includes("--id"), true);
		assert.equal(consoleErrorOutput.includes("number"), true);
	});

	void it("prints command help without executing the command", async() => {
		TESTImplementation.set("getProcessArguments", () => ["--help"]);
		let executeCalled = false;

		const result = await DServerCommand.exec(
			{
				displayName: "cli",
				description: "Integration command.",
				options: [DServerCommand.createBooleanOption("verbose", { aliases: ["v"] })],
				subjects: [DServerCommand.createArgument("target", DDataStructure.string())],
			},
			() => {
				executeCalled = true;
			},
		);

		assert.equal(DEither.isRight(result), true);
		assert.equal(executeCalled, false);
		assert.equal(consoleLogOutput.includes("COMMAND"), true);
		assert.equal(consoleLogOutput.includes("cli"), true);
		assert.equal(consoleLogOutput.includes("--"), true);
		assert.equal(consoleLogOutput.includes("verbose"), true);
	});
});
