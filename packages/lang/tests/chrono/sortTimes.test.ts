import { DChrono, type DArray, pipe } from "@scripts";

describe("DChrono sortTimes", () => {
	const time01 = DChrono.createTime(1, "second");
	const time05 = DChrono.createTime(5, "second");
	const time10 = DChrono.createTime(10, "second");

	it("sorts ascending and descending", () => {
		const asc = DChrono.sortTimes(
			[time05, time10, time01] as DChrono.TheTime[] & DArray.MinElements<1>,
			"ASC",
		);
		const dsc = pipe(
			[time01, time05, time10] as DChrono.TheTime[] & DArray.MinElements<1>,
			DChrono.sortTimes("DSC"),
		);

		expect(asc.map(DChrono.toTimeValue)).toEqual([
			DChrono.toTimeValue(time01),
			DChrono.toTimeValue(time05),
			DChrono.toTimeValue(time10),
		]);
		expect(dsc.map(DChrono.toTimeValue)).toEqual([
			DChrono.toTimeValue(time10),
			DChrono.toTimeValue(time05),
			DChrono.toTimeValue(time01),
		]);
	});
});
