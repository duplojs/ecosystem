import { stripVTControlCharacters } from "node:util";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import { DSCommand } from "@scripts";

describe("error", () => {
	it("creates a command error and records every issue kind", () => {
		const error = DSCommand.createError("root");
		const dataStructureError = { issues: [] } as unknown as DDataStructure.Error;

		type _CheckError = DCommon.ExpectType<
			typeof error,
			DSCommand.Error,
			"strict"
		>;

		error.pushPath("child");

		expect(error.addRequiredOptionIssue("token")).toBe(DSCommand.SymbolCommandError);
		expect(error.addRequiredOptionValueIssue("name")).toBe(DSCommand.SymbolCommandError);
		expect(error.addUnexpectedOptionValueIssue("verbose", "true")).toBe(DSCommand.SymbolCommandError);
		expect(error.addDataStructureOptionIssue("count", "NaN", dataStructureError)).toBe(DSCommand.SymbolCommandError);
		expect(error.addRequiredArgumentIssue("id")).toBe(DSCommand.SymbolCommandError);
		expect(error.addDataStructureArgumentIssue("age", "old", dataStructureError)).toBe(DSCommand.SymbolCommandError);
		expect(error.addTooMuchCommandArgumentIssue(1, 3)).toBe(DSCommand.SymbolCommandError);
		expect(error.addUnknownOptionIssue(["--prot", "-x"])).toBe(DSCommand.SymbolCommandError);
		expect(error.addUnknownSubCommandIssue("chlid")).toBe(DSCommand.SymbolCommandError);

		expect(error.currentPath).toEqual(["root", "child"]);
		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "token",
				data: undefined,
				path: "root.child",
			}),
			expect.objectContaining({
				optionName: "name",
				data: undefined,
				path: "root.child",
			}),
			expect.objectContaining({
				optionName: "verbose",
				data: "true",
				path: "root.child",
			}),
			expect.objectContaining({
				optionName: "count",
				data: "NaN",
				dataStructureError,
				path: "root.child",
			}),
			expect.objectContaining({
				argumentName: "id",
				data: undefined,
				path: "root.child",
			}),
			expect.objectContaining({
				argumentName: "age",
				data: "old",
				dataStructureError,
				path: "root.child",
			}),
			expect.objectContaining({
				expect: 1,
				receive: 3,
				path: "root.child",
			}),
			DModeling.taggedObject("UnknownOptionIssue", {
				optionTokens: ["--prot", "-x"],
				path: "root.child",
			}) satisfies DSCommand.UnknownOptionIssue,
			DModeling.taggedObject("UnknownSubCommandIssue", {
				subCommandName: "chlid",
				path: "root.child",
			}) satisfies DSCommand.UnknownSubCommandIssue,
		]);
	});

	it("interprets data structure errors with message priority and fallback", () => {
		const dataStructureError = { issues: [] } as unknown as DDataStructure.Error;
		const dataStructureErrorInterpreter = vi.fn().mockReturnValue([
			{
				path: "value",
				interpretedMessage: {
					subSource: "sub source",
					interpretedSubSource: "interpreted sub source",
					source: "source",
					interpretedSource: "interpreted source",
				},
			},
			{
				path: "nested",
				interpretedMessage: {
					interpretedSubSource: "interpreted sub source",
					source: "source",
					interpretedSource: "interpreted source",
				},
			},
			{
				path: "source",
				interpretedMessage: {
					source: "source",
					interpretedSource: "interpreted source",
				},
			},
			{
				path: "",
				interpretedMessage: {
					interpretedSource: "interpreted source",
				},
			},
			{
				path: "",
				interpretedMessage: {},
			},
		]);

		const result = DSCommand.interpretDataStructureError(dataStructureError, dataStructureErrorInterpreter);

		expect(dataStructureErrorInterpreter).toHaveBeenCalledWith(dataStructureError);
		expect(DArray.map(result, stripVTControlCharacters)).toMatchSnapshot();
	});

	it("renders all command issue kinds", () => {
		const dataStructureError = { issues: [] } as unknown as DDataStructure.Error;
		const error = DSCommand.createError("root");
		const dataStructureErrorInterpreter = vi.fn().mockReturnValue([
			{
				path: "",
				interpretedMessage: {
					source: "invalid value",
				},
			},
		]);

		error.addDataStructureArgumentIssue("id", "bad", dataStructureError);
		error.addRequiredArgumentIssue("name");
		error.addDataStructureOptionIssue("count", "bad", dataStructureError);
		error.addRequiredOptionIssue("token");
		error.addRequiredOptionValueIssue("config");
		error.addUnexpectedOptionValueIssue("verbose", "true");
		error.addTooMuchCommandArgumentIssue(1, 2);
		error.addUnknownOptionIssue(["--prot", "--hots=localhost", "-x"]);
		error.addUnknownSubCommandIssue("chlid");

		const result = DSCommand.interpretErrorIssues(error.issues, dataStructureErrorInterpreter);

		expect(dataStructureErrorInterpreter).toHaveBeenCalledTimes(2);
		expect(stripVTControlCharacters(result)).toMatchSnapshot();
	});

	it("renders a message when no issue exists", () => {
		const result = DSCommand.interpretErrorIssues(
			[],
			vi.fn().mockReturnValue([]),
		);

		expect(stripVTControlCharacters(result)).toMatchSnapshot();
	});

	it("renders command execution errors with the default interpreter", () => {
		const error = DSCommand.createError("root");
		const checkResult = DDataStructure.number().check("bad");

		if (!DEither.isLeft(checkResult)) {
			throw new Error("Expected number check to return a left.");
		}

		error.pushPath("child");

		DCommon.asserts(checkResult, DEither.hasInformation("check-error"));

		error.addDataStructureArgumentIssue(
			"id",
			"bad",
			DEither.unwrapLeft(checkResult),
		);

		const result = DSCommand.interpretExecCommandError(error);

		expect(stripVTControlCharacters(result)).toMatchSnapshot();
	});

	it("renders command execution errors with a custom interpreter", () => {
		const error = DSCommand.createError("root");
		const dataStructureError = { issues: [] } as unknown as DDataStructure.Error;
		const dataStructureErrorInterpreter = vi.fn().mockReturnValue([
			{
				path: "",
				interpretedMessage: {
					source: "custom command error",
				},
			},
		]);

		error.addDataStructureArgumentIssue("id", "bad", dataStructureError);

		const result = DSCommand.interpretExecCommandError(error, dataStructureErrorInterpreter);

		expect(dataStructureErrorInterpreter).toHaveBeenCalledWith(dataStructureError);
		expect(stripVTControlCharacters(result)).toMatchSnapshot();
	});

	it("renders options execution errors with the default interpreter", () => {
		const error = DSCommand.createError("root");

		error.addRequiredOptionIssue("token");

		const result = DSCommand.interpretExecOptionsError(error);

		expect(stripVTControlCharacters(result)).toMatchSnapshot();
	});

	it("renders options execution errors with a custom interpreter", () => {
		const error = DSCommand.createError("root");
		const dataStructureError = { issues: [] } as unknown as DDataStructure.Error;
		const dataStructureErrorInterpreter = vi.fn().mockReturnValue([
			{
				path: "",
				interpretedMessage: {
					source: "custom option error",
				},
			},
		]);

		error.addDataStructureOptionIssue("count", "bad", dataStructureError);

		const result = DSCommand.interpretExecOptionsError(error, dataStructureErrorInterpreter);

		expect(dataStructureErrorInterpreter).toHaveBeenCalledWith(dataStructureError);
		expect(stripVTControlCharacters(result)).toMatchSnapshot();
	});
});
