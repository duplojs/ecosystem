import { DString, pipe, type ExpectType } from "@scripts";

describe("test", () => {
	it("should test a string against a regexp", () => {
		const result = DString.test("user-42", /^user-\d+$/);

		expect(result).toBe(true);

		type _CheckResult = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});

	it("should test a string against a regexp in pipe", () => {
		const result = pipe(
			"user-42",
			DString.test(/^user-\d+$/),
		);

		expect(result).toBe(true);
	});
});
