import { DChrono, type DArray } from "@scripts";

describe("DChrono minTime", () => {
	const time01 = DChrono.createTime(1, "second");
	const time05 = DChrono.createTime(5, "second");
	const time10 = DChrono.createTime(10, "second");

	it("picks smallest time", () => {
		const result = DChrono.minTime(
			[time10, time05, time01] as DChrono.TheTime[] & DArray.MinElements<1>,
		);

		expect(DChrono.toTimeValue(result)).toBe(
			DChrono.toTimeValue(time01),
		);
	});
});
