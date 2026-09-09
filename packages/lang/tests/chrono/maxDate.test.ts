import { DChrono, type DArray } from "@scripts";

describe("DChrono max", () => {
	const jan01 = DChrono.createDate("2024-01-01");
	const jan05 = DChrono.createDate("2024-01-05");
	const jan10 = DChrono.createDate("2024-01-10");

	it("picks latest date", () => {
		const result = DChrono.maxDate(
			[jan01, jan10, jan05] as DChrono.TheDate[] & DArray.MinElements<1>,
		);

		expect(DChrono.toTimestamp(result)).toBe(
			DChrono.toTimestamp(jan10),
		);
	});
});
