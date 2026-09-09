import { DChrono, type DArray } from "@scripts";

describe("DChrono maxTime", () => {
	const time01 = DChrono.createTime(1, "second");
	const time05 = DChrono.createTime(5, "second");
	const time10 = DChrono.createTime(10, "second");

	it("picks largest time", () => {
		const result = DChrono.maxTime(
			[time01, time10, time05] as DChrono.TheTime[] & DArray.MinElements<1>,
		);

		expect(DChrono.toTimeValue(result)).toBe(
			DChrono.toTimeValue(time10),
		);
	});
});
