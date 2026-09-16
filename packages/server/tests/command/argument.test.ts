import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DSCommand, DSDataStructure, TESTImplementation, setEnvironment } from "@scripts";

describe("createArgument", () => {
	afterEach(() => {
		setEnvironment("NODE");
		TESTImplementation.clear();
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it("creates a required argument", () => {
		const dataStructure = DDataStructure.number();
		const argument = DSCommand.createArgument("id", dataStructure);

		type _CheckArgument = DCommon.ExpectType<
			typeof argument,
			DSCommand.Argument<"id", number>,
			"strict"
		>;

		expect(argument.name).toBe("id");
		expect(argument.dataStructure).toBe(dataStructure);
		expect(argument.description).toBeNull();
		expect(argument.optional).toBe(false);
		expect(DSCommand.argumentKind.has(argument)).toBe(true);
	});

	it("creates an optional argument with a description", () => {
		const argument = DSCommand.createArgument(
			"tag",
			DDataStructure.string(),
			{
				description: "Release tag.",
				optional: true,
			},
		);

		type _CheckArgument = DCommon.ExpectType<
			typeof argument,
			DSCommand.Argument<"tag", string | undefined>,
			"strict"
		>;

		expect(argument.description).toBe("Release tag.");
		expect(argument.optional).toBe(true);
	});

	it("returns a command error when a required argument is missing", async() => {
		const argument = DSCommand.createArgument("id", DDataStructure.number());
		const error = DSCommand.createError("root");

		await expect(argument.execute(undefined, error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			expect.objectContaining({
				argumentName: "id",
				data: undefined,
				path: "root",
			}),
		]);
	});

	it("returns undefined when an optional argument is missing", async() => {
		const argument = DSCommand.createArgument("tag", DDataStructure.string(), { optional: true });
		const error = DSCommand.createError("root");

		await expect(argument.execute(undefined, error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
	});

	it("decodes an argument", async() => {
		const argument = DSCommand.createArgument("id", DDataStructure.number());
		const error = DSCommand.createError("root");

		await expect(argument.execute("42", error)).resolves.toBe(42);

		expect(error.issues).toEqual([]);
	});

	it("returns a command error when decoding fails", async() => {
		const argument = DSCommand.createArgument("id", DDataStructure.number());
		const error = DSCommand.createError("root");

		await expect(argument.execute("bad-id", error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toEqual([
			expect.objectContaining({
				argumentName: "id",
				data: "bad-id",
				path: "root",
			}),
		]);
	});

	it("supports asynchronous data structure decoding", async() => {
		setEnvironment("TEST");
		TESTImplementation.set(
			"stat",
			vi.fn().mockResolvedValue(DEither.success({
				isFile: true,
				sizeBytes: 1,
			} as never)),
		);

		const argument = DSCommand.createArgument(
			"file",
			DSDataStructure.file().addConstraint(DSDataStructure.exist()),
		);
		const error = DSCommand.createError("root");

		await expect(argument.execute("/tmp/demo.txt", error)).resolves.toMatchObject({
			path: "/tmp/demo.txt",
		});
		expect(error.issues).toEqual([]);
	});
});
