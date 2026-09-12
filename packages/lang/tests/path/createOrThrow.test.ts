import { DPath, type ExpectType } from "@scripts";

describe("createOrThrow", () => {
	it("creates a normalized path", () => {
		const result = DPath.createOrThrow("foo/../bar");

		expect(result).toBe("bar");
		expect(DPath.is(result)).toBe(true);
	});

	it("throws a CreatePathError with the original input for invalid paths", () => {
		const input = "foo\0bar";

		expect(() => DPath.createOrThrow(input)).toThrow(DPath.CreatePathError);

		try {
			DPath.createOrThrow(input);
		} catch (error) {
			expect(error).toBeInstanceOf(DPath.CreatePathError);
			expect((error as DPath.CreatePathError).value).toBe(input);
		}
	});

	it("returns the input type constrained as a path", () => {
		const value = "foo/../bar";
		const result = DPath.createOrThrow(value);

		type _CheckResult = ExpectType<
			typeof result,
			string & DPath.Path,
			"strict"
		>;
	});
});
