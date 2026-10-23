import * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";

describe("round", () => {
	it("rounds to day by default", () => {
		const result = DChrono.round(DChrono.createDate("2024-01-15", {
			hour: "12",
			minute: "34",
			second: "56",
			millisecond: "789",
		}));

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-15")),
		);

		type check = DCommon.ExpectType<
			typeof result,
			DChrono.TheDate,
			"strict"
		>;
	});

	it("rounds to hour", () => {
		const result = DChrono.round(
			DChrono.createDate("2024-01-15", {
				hour: "12",
				minute: "34",
				second: "56",
				millisecond: "789",
			}),
			"hour",
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-15", { hour: "12" })),
		);
	});

	it("rounds to minute", () => {
		const result = DChrono.round(
			DChrono.createDate("2024-01-15", {
				hour: "12",
				minute: "34",
				second: "56",
				millisecond: "789",
			}),
			"minute",
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-15", {
				hour: "12",
				minute: "34",
			})),
		);
	});

	it("rounds to second", () => {
		const result = DChrono.round(
			DChrono.createDate("2024-01-15", {
				hour: "12",
				minute: "34",
				second: "56",
				millisecond: "789",
			}),
			"second",
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-15", {
				hour: "12",
				minute: "34",
				second: "56",
			})),
		);
	});

	it("rounds to month", () => {
		const result = DChrono.round(
			DChrono.createDate("2024-03-15", {
				hour: "12",
				minute: "34",
				second: "56",
				millisecond: "789",
			}),
			"month",
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-03-01")),
		);
	});

	it("rounds to year", () => {
		const result = DChrono.round(
			DChrono.createDate("2024-07-10", {
				hour: "12",
				minute: "34",
				second: "56",
				millisecond: "789",
			}),
			"year",
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-01")),
		);
	});

	it("handles dates before Christ", () => {
		const result = DChrono.round(
			DChrono.createDate("-5-03-15", {
				hour: "10",
				minute: "30",
			}),
			"day",
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("-5-03-15")),
		);
	});

	it("use in pipe", () => {
		const result = DCommon.pipe(
			DChrono.createDate("2024-01-15", {
				hour: "12",
				minute: "34",
				second: "56",
				millisecond: "789",
			}),
			DChrono.round,
		);

		expect(DChrono.serialize(result)).toBe(
			DChrono.serialize(DChrono.createDate("2024-01-15")),
		);
	});
});
