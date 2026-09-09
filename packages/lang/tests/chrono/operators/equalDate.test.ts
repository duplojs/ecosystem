import { pipe, type ExpectType, DChrono } from "@scripts";

describe("equal", () => {
	it("simple case", () => {
		const result = DChrono.equalDate(
			DChrono.createDate("2024-01-03"),
			DChrono.createDate("2024-01-03"),
		);

		expect(result).toBe(true);
	});

	it("with serialized", () => {
		const result = DChrono.equalDate(
			DChrono.createDate("2024-01-03").toString(),
			DChrono.createDate("2024-01-03").toString(),
		);

		expect(result).toBe(true);
	});

	it("with TheDate/serialized", () => {
		const result = DChrono.equalDate(
			DChrono.createDate("2024-01-03"),
			DChrono.createDate("2024-01-03").toString(),
		);

		expect(result).toBe(true);
	});

	it("different date", () => {
		const result = DChrono.equalDate(
			DChrono.createDate("2024-01-03"),
			DChrono.createDate("2024-01-04"),
		);

		expect(result).toBe(false);
	});

	it("different date (TheDate/serialized)", () => {
		const result = DChrono.equalDate(
			DChrono.createDate("2024-01-03"),
			DChrono.createDate("2024-01-04").toString(),
		);

		expect(result).toBe(false);
	});

	it("use in pipe", () => {
		const result = pipe(
			DChrono.createDate("2024-01-03"),
			DChrono.equalDate(DChrono.createDate("2024-01-03")),
		);

		type _check = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;

		expect(result).toBe(true);
	});
});
