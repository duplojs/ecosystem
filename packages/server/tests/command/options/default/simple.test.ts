import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSCommand } from "@scripts";

describe("createOption", () => {
	it("creates an optional simple option", () => {
		const dataStructure = DDataStructure.string();
		const option = DSCommand.createOption("name", dataStructure, {
			description: "User name.",
			aliases: ["n"],
		});

		type _CheckOption = DCommon.ExpectType<
			typeof option,
			DSCommand.SimpleOption<"name", string | undefined>,
			"strict"
		>;

		expect(option.name).toBe("name");
		expect(option.dataStructure).toBe(dataStructure);
		expect(option.description).toBe("User name.");
		expect(option.aliases).toEqual(["n"]);
		expect(option.required).toBe(false);
		expect(DSCommand.simpleOptionKind.has(option)).toBe(true);
	});

	it("creates a required simple option", () => {
		const option = DSCommand.createOption("count", DDataStructure.number(), {
			required: true,
		});

		type _CheckOption = DCommon.ExpectType<
			typeof option,
			DSCommand.SimpleOption<"count", number>,
			"strict"
		>;

		expect(option.description).toBeNull();
		expect(option.aliases).toEqual([]);
		expect(option.required).toBe(true);
	});

	it("returns undefined when an optional simple option is missing", async() => {
		const option = DSCommand.createOption("name", DDataStructure.string());
		const error = DSCommand.createError("root");

		await expect(option.execute([], error)).resolves.toEqual({
			result: undefined,
			argumentRest: [],
		});
		expect(error.issues).toEqual([]);
	});

	it("returns a command error when a required simple option is missing", async() => {
		const option = DSCommand.createOption("name", DDataStructure.string(), {
			required: true,
		});
		const error = DSCommand.createError("root");

		await expect(option.execute([], error)).resolves.toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "name",
				data: undefined,
				path: "root",
			}),
		]);
	});

	it("returns a command error when a simple option value is missing", async() => {
		const option = DSCommand.createOption("name", DDataStructure.string());
		const error = DSCommand.createError("root");

		await expect(option.execute(["--name"], error)).resolves.toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "name",
				data: undefined,
				path: "root",
			}),
		]);
	});

	it("decodes a simple option value", async() => {
		const option = DSCommand.createOption("count", DDataStructure.number());
		const error = DSCommand.createError("root");

		await expect(option.execute(["--count", "42", "rest"], error)).resolves.toEqual({
			result: 42,
			argumentRest: ["rest"],
		});
		expect(error.issues).toEqual([]);
	});

	it("decodes a simple option alias value", async() => {
		const option = DSCommand.createOption("name", DDataStructure.string(), {
			aliases: ["n"],
		});
		const error = DSCommand.createError("root");

		await expect(option.execute(["-n=duplo"], error)).resolves.toEqual({
			result: "duplo",
			argumentRest: [],
		});
		expect(error.issues).toEqual([]);
	});

	it("returns a command error when simple option decoding fails", async() => {
		const option = DSCommand.createOption("count", DDataStructure.number());
		const error = DSCommand.createError("root");

		await expect(option.execute(["--count", "bad"], error)).resolves.toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toEqual([
			expect.objectContaining({
				optionName: "count",
				data: "bad",
				path: "root",
			}),
		]);
	});
});
