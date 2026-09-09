import { pipe, type ExpectType, DChrono } from "@scripts";

describe("closestTo", () => {
	it("returns closest date without tie breaker", () => {
		const dates = [
			DChrono.createDate("2024-01-01"),
			DChrono.createDate("2024-01-05"),
			DChrono.createDate("2024-01-09"),
			DChrono.createDate("2024-01-15"),
		];

		const result = DChrono.closestTo(
			dates,
			DChrono.createDate("2024-01-06"),
		);

		expect(
			DChrono.toTimestamp(result!),
		).toBe(
			DChrono.toTimestamp(DChrono.createDate("2024-01-05")),
		);

		type check = ExpectType<
			typeof result,
			DChrono.TheDate | undefined,
			"strict"
		>;
	});

	it("handles TheDate instances in iterable", () => {
		const input = [
			DChrono.createDate("2024-01-02"),
			DChrono.createDate("2024-01-10"),
		];

		const result = DChrono.closestTo(
			input,
			DChrono.createDate("2024-01-03"),
		);

		expect(
			DChrono.toTimestamp(result!),
		).toBe(
			DChrono.toTimestamp(DChrono.createDate("2024-01-02")),
		);
	});

	it("keeps TheDate paths in the reducer", () => {
		const input = [
			DChrono.createDateOrThrow(0),
			DChrono.serialize(DChrono.createDate("2024-01-01")),
		];

		const result = DChrono.closestTo(
			input,
			DChrono.createDate("1970-01-01"),
		);

		expect(result).toBeInstanceOf(DChrono.TheDate);
	});

	it("executes TheDate branch when distance improves", () => {
		const input = [DChrono.createDateOrThrow(0)];

		const result = DChrono.closestTo(
			input,
			DChrono.createDate("1970-01-01"),
		);

		expect(result).toBeInstanceOf(DChrono.TheDate);
	});

	it("executes non-TheDate branch when distance improves", () => {
		const input = [
			DChrono.serialize(DChrono.createDate("1970-01-02")),
			DChrono.createDateOrThrow(0),
		];

		const result = DChrono.closestTo(
			input,
			DChrono.createDate("1970-01-03"),
		);

		expect(result).toBeInstanceOf(DChrono.TheDate);
	});

	it("filters to past dates when tieBreaker is favorPast", () => {
		const dates = [
			DChrono.createDate("2024-01-01"),
			DChrono.createDate("2024-01-05"),
			DChrono.createDate("2024-01-09"),
			DChrono.createDate("2024-01-15"),
		];

		const result = DChrono.closestTo(
			dates,
			DChrono.createDate("2024-01-08"),
			{ tieBreaker: "favorPast" },
		);

		expect(
			DChrono.toTimestamp(result!),
		).toBe(
			DChrono.toTimestamp(DChrono.createDate("2024-01-05")),
		);
	});

	it("filters to future dates when tieBreaker is favorFuture", () => {
		const dates = [
			DChrono.createDate("2024-01-01"),
			DChrono.createDate("2024-01-05"),
			DChrono.createDate("2024-01-09"),
			DChrono.createDate("2024-01-15"),
		];

		const result = DChrono.closestTo(
			dates,
			DChrono.createDate("2024-01-08"),
			{ tieBreaker: "favorFuture" },
		);

		expect(
			DChrono.toTimestamp(result!),
		).toBe(
			DChrono.toTimestamp(DChrono.createDate("2024-01-09")),
		);
	});

	it("use in pipe", () => {
		const dates = [
			DChrono.createDate("2024-01-01"),
			DChrono.createDate("2024-01-05"),
			DChrono.createDate("2024-01-09"),
			DChrono.createDate("2024-01-15"),
		];

		const selectClosest = DChrono.closestTo(
			DChrono.createDate("2024-01-10"),
			{ tieBreaker: "favorFuture" },
		);

		const result = pipe(
			dates,
			selectClosest,
		);

		expect(
			DChrono.toTimestamp(result!),
		).toBe(
			DChrono.toTimestamp(DChrono.createDate("2024-01-15")),
		);
	});

	it("when iterable is empty or filtered out", () => {
		const dates = [
			DChrono.createDate("2024-01-01"),
			DChrono.createDate("2024-01-05"),
			DChrono.createDate("2024-01-09"),
			DChrono.createDate("2024-01-15"),
		];

		expect(DChrono.closestTo(
			[],
			DChrono.createDate("2024-01-01"),
		)).toBeUndefined();

		expect(DChrono.closestTo(
			dates,
			DChrono.createDate("2023-12-15"),
			{ tieBreaker: "favorPast" },
		)).toBeUndefined();

		expect(DChrono.closestTo(
			dates,
			DChrono.createDate("2024-12-01"),
			{ tieBreaker: "favorFuture" },
		)).toBeUndefined();
	});
});
