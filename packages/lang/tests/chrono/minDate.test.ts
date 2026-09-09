import { DChrono, type DArray } from "@scripts";

describe("DChrono min", () => {
	const jan01 = DChrono.createDate("2024-01-01");
	const jan05 = DChrono.createDate("2024-01-05");
	const jan10 = DChrono.createDate("2024-01-10");

	it("picks earliest date", () => {
		const result = DChrono.minDate(
			[jan10, jan05, jan01] as DChrono.TheDate[] & DArray.MinElements<1>,
		);

		expect(DChrono.toTimestamp(result)).toBe(
			DChrono.toTimestamp(jan01),
		);
	});
});
