import { DChrono, type DArray, pipe } from "@scripts";

describe("DChrono sort", () => {
	const jan01 = DChrono.createDate("2024-01-01");
	const jan05 = DChrono.createDate("2024-01-05");
	const jan10 = DChrono.createDate("2024-01-10");

	it("sorts ascending and descending", () => {
		const asc = DChrono.sortDates(
			[jan05, jan10, jan01] as DChrono.TheDate[] & DArray.MinElements<1>,
			"ASC",
		);
		const dsc = pipe(
			[jan01, jan05, jan10] as DChrono.TheDate[] & DArray.MinElements<1>,
			DChrono.sortDates("DSC"),
		);

		expect(asc.map(DChrono.toTimestamp)).toEqual([
			DChrono.toTimestamp(jan01),
			DChrono.toTimestamp(jan05),
			DChrono.toTimestamp(jan10),
		]);
		expect(dsc.map(DChrono.toTimestamp)).toEqual([
			DChrono.toTimestamp(jan10),
			DChrono.toTimestamp(jan05),
			DChrono.toTimestamp(jan01),
		]);
	});
});
