import { DEither, type ExpectType } from "@scripts";

describe("isLeft", () => {
	it("should identify left values and reject other inputs", () => {
		expect(DEither.isLeft(DEither.left("value", 1))).toBe(true);
		expect(DEither.isLeft(DEither.right("value", 1))).toBe(false);
		expect(DEither.isLeft({})).toBe(false);
		expect(DEither.isLeft(null)).toBe(false);
	});

	it("should narrow an unknown union to left values", () => {
		const input: DEither.Success<42> | DEither.Error<"message"> | "plain" = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		if (DEither.isLeft(input)) {
			type _CheckInput = ExpectType<
				typeof input,
				DEither.Error<"message">,
				"strict"
			>;
			expect(DEither.unwrapLeft(input)).toBe("message");
		}
	});
});
