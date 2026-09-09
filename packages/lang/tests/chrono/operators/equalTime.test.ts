import { DChrono, pipe, type ExpectType } from "@scripts";

describe("equalTime", () => {
	it("returns true for equal times", () => {
		const result = DChrono.equalTime(
			DChrono.createTime(2, "second"),
			DChrono.createTime(2, "second"),
		);

		expect(result).toBe(true);
	});

	it("supports serialized times", () => {
		const result = DChrono.equalTime(
			"time2000+",
			DChrono.createTime(2, "second"),
		);

		expect(result).toBe(true);
	});

	it("returns false for different times", () => {
		const result = DChrono.equalTime(
			DChrono.createTime(2, "second"),
			DChrono.createTime(3, "second"),
		);

		expect(result).toBe(false);
	});

	it("supports pipe usage", () => {
		const result = pipe(
			DChrono.createTime(2, "second"),
			DChrono.equalTime("time2000+"),
		);

		expect(result).toBe(true);

		type _CheckResult = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;
	});
});
