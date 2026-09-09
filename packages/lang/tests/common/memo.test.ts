import { DCommon, type ExpectType } from "@scripts";

describe("memo", () => {
	it("computes the value once and then reuses it", () => {
		let callCount = 0;
		const memoized = DCommon.memo(() => {
			callCount++;

			return "value" as const;
		});

		type _CheckValue = ExpectType<
			typeof memoized.value,
			"value",
			"strict"
		>;

		expect(memoized.value).toBe("value");
		expect(memoized.value).toBe("value");
		expect(callCount).toBe(1);
	});
});
