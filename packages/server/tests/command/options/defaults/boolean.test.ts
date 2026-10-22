import type * as DCommon from "@duplojs/lang/common";
import * as DModeling from "@duplojs/lang/modeling";
import { DSCommand } from "@scripts";

describe("createBooleanOption", () => {
	it("creates a boolean option", () => {
		const option = DSCommand.createBooleanOption("verbose", {
			description: "Enable verbose logs.",
			aliases: ["v"],
		});

		type _CheckOption = DCommon.ExpectType<
			typeof option,
			DSCommand.BooleanOption<"verbose">,
			"strict"
		>;

		expect(option.name).toBe("verbose");
		expect(option.description).toBe("Enable verbose logs.");
		expect(option.aliases).toEqual(["v"]);
		expect(DSCommand.optionKind.has(option)).toBe(true);
		expect(DSCommand.booleanOptionKind.has(option)).toBe(true);
	});

	it("uses default metadata", () => {
		const option = DSCommand.createBooleanOption("verbose");

		expect(option.description).toBeNull();
		expect(option.aliases).toEqual([]);
	});

	it.each([
		{
			args: [],
			expected: false,
			argumentRest: [],
		},
		{
			args: ["positional", "--other"],
			expected: false,
			argumentRest: ["positional", "--other"],
		},
		{
			args: ["--verbose"],
			expected: true,
			argumentRest: [],
		},
		{
			args: ["-v"],
			expected: true,
			argumentRest: [],
		},
		{
			args: ["--verbose", "app"],
			expected: true,
			argumentRest: ["app"],
		},
		{
			args: ["app", "--verbose"],
			expected: true,
			argumentRest: ["app"],
		},
		{
			args: ["app", "--verbose", "dist"],
			expected: true,
			argumentRest: ["app", "dist"],
		},
		{
			args: ["app", "-v", "dist"],
			expected: true,
			argumentRest: ["app", "dist"],
		},
		{
			args: ["--verbose", "--rest"],
			expected: true,
			argumentRest: ["--rest"],
		},
		{
			args: ["--other", "--verbose"],
			expected: true,
			argumentRest: ["--other"],
		},
		{
			args: ["--verbose", "--output", "dist"],
			expected: true,
			argumentRest: ["--output", "dist"],
		},
		{
			args: ["--v"],
			expected: false,
			argumentRest: ["--v"],
		},
		{
			args: ["--verbose", "-v", "app"],
			expected: true,
			argumentRest: ["-v", "app"],
		},
	])("parses $args without consuming other tokens", async({ args, expected, argumentRest }) => {
		const option = DSCommand.createBooleanOption("verbose", {
			aliases: ["v"],
		});
		const error = DSCommand.createError("root");
		const originalArgs = [...args];
		const result = await option.execute(args, error);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				result: boolean;
				argumentRest: readonly string[];
			} | DSCommand.SymbolCommandError,
			"strict"
		>;

		expect(result).toEqual({
			result: expected,
			argumentRest,
		});
		expect(args).toEqual(originalArgs);
		expect(error.issues).toEqual([]);
	});

	it("does not recognize an undeclared alias", async() => {
		const option = DSCommand.createBooleanOption("verbose");
		const error = DSCommand.createError("root");

		await expect(option.execute(["-v", "app"], error)).resolves.toEqual({
			result: false,
			argumentRest: ["-v", "app"],
		});
		expect(error.issues).toEqual([]);
	});

	it.each([
		{
			token: "--verbose=true",
			value: "true",
		},
		{
			token: "--verbose=",
			value: "",
		},
		{
			token: "-v=false",
			value: "false",
		},
		{
			token: "-v=",
			value: "",
		},
	])("rejects the explicit value in $token", async({ token, value }) => {
		const option = DSCommand.createBooleanOption("verbose", { aliases: ["v"] });
		const error = DSCommand.createError("root");

		await expect(option.execute([token], error)).resolves.toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toEqual([
			DModeling.taggedObject("UnexpectedOptionValueIssue", {
				optionName: "verbose",
				data: value,
				path: "root",
			}),
		]);
	});
});
