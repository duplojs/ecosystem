import { DEither, type ExpectType } from "@scripts";

describe("isRight", () => {
	it("should identify right values and reject other inputs", () => {
		expect(DEither.isRight(DEither.right("value", 1))).toBe(true);
		expect(DEither.isRight(DEither.left("value", 1))).toBe(false);
		expect(DEither.isRight({})).toBe(false);
		expect(DEither.isRight(null)).toBe(false);
	});

	it("should narrow an unknown union to right values", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		if (DEither.isRight(input)) {
			type _CheckInput = ExpectType<
				typeof input,
				DEither.Success<42>,
				"strict"
			>;
			expect(DEither.unwrapRight(input)).toBe(42);
		}
	});
});
