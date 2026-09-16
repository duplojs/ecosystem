import type * as DCommon from "@duplojs/lang/common";
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
		expect(DSCommand.booleanOptionKind.has(option)).toBe(true);
	});

	it("returns false when a boolean option is missing", async() => {
		const option = DSCommand.createBooleanOption("verbose");
		const error = DSCommand.createError("root");

		await expect(option.execute(["positional", "--other"], error)).resolves.toEqual({
			result: false,
			argumentRest: ["positional", "--other"],
		});
		expect(error.issues).toEqual([]);
	});

	it("returns true when a boolean option is present", async() => {
		const option = DSCommand.createBooleanOption("verbose");
		const error = DSCommand.createError("root");

		await expect(option.execute(["--verbose", "--rest"], error)).resolves.toEqual({
			result: true,
			argumentRest: ["--rest"],
		});
		expect(error.issues).toEqual([]);
	});

	it("returns true when a boolean alias is present", async() => {
		const option = DSCommand.createBooleanOption("verbose", {
			aliases: ["v"],
		});
		const error = DSCommand.createError("root");

		await expect(option.execute(["-v"], error)).resolves.toEqual({
			result: true,
			argumentRest: [],
		});
		expect(error.issues).toEqual([]);
	});

	it("returns a command error when a boolean option receives a value", async() => {
		const option = DSCommand.createBooleanOption("verbose");
		const error = DSCommand.createError("root");

		await expect(option.execute(["--verbose=true"], error)).resolves.toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "verbose",
				data: "true",
				path: "root",
			}),
		]);
	});
});
