import type * as DCommon from "@scripts/common";
import * as DChrono from "@scripts/chrono";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";

describe("codecsNativeChrono", () => {
	it("round trips native values through an object structure", () => {
		const structure = DDataStructure.object({
			date: DDataStructure.date(),
			time: DDataStructure.time(),
		});
		const input = {
			date: DChrono.createDateOrThrow(Date.UTC(2024, 0, 2, 3, 4, 5, 6)),
			time: DChrono.createTimeOrThrow(3_661_007),
		};
		const encoded = DEither.unwrapByInformationOrThrow(
			structure.encode(DDataStructure.codecsNativeChrono, input),
			"encode-success",
		);
		const decoded = DEither.unwrapByInformationOrThrow(
			structure.decode(DDataStructure.codecsNativeChrono, encoded),
			"decode-success",
		);

		type _CheckEncoded = DCommon.ExpectType<
			typeof encoded,
			{
				readonly date: Date;
				readonly time: number;
			},
			"strict"
		>;

		type _CheckDecoded = DCommon.ExpectType<
			typeof decoded,
			{
				readonly date: DChrono.TheDate;
				readonly time: DChrono.TheTime;
			},
			"strict"
		>;

		expect(encoded).toStrictEqual({
			date: new Date("2024-01-02T03:04:05.006Z"),
			time: 3_661_007,
		});
		expect(decoded).toStrictEqual(input);
	});

	it("narrows native date and time inputs", () => {
		const { date, time } = DDataStructure.codecsNativeChrono.definition;
		const nativeDate: unknown = new Date(0);
		const nativeTime: unknown = 0;

		if (date.predicateEncode(nativeDate)) {
			type _CheckDate = DCommon.ExpectType<typeof nativeDate, Date, "strict">;
		}

		if (time.predicateEncode(nativeTime)) {
			type _CheckTime = DCommon.ExpectType<typeof nativeTime, number, "strict">;
		}

		expect(date.predicateEncode(nativeDate)).toBe(true);
		expect(time.predicateEncode(nativeTime)).toBe(true);
		for (const value of [null, undefined, "2024-01-02", {}, 0]) {
			expect(date.predicateEncode(value)).toBe(false);
		}
		for (const value of [null, undefined, "1000", new Date(0), DChrono.createTimeOrThrow(0)]) {
			expect(time.predicateEncode(value)).toBe(false);
		}
	});

	it.each([0, -1, Date.UTC(2024, 0, 2, 3, 4, 5, 6)])("converts native date timestamp %i", async(timestamp) => {
		const codec = DDataStructure.codecsNativeChrono.definition.date;

		type _CheckCodec = DCommon.ExpectType<
			typeof codec,
			DDataStructure.Codec<DDataStructure.TheDate, Date>,
			"strict"
		>;

		const native = new Date(timestamp);
		const decoded = await codec.decode(native);
		expect(decoded).toStrictEqual(DChrono.createDateOrThrow(timestamp));
		expect(await codec.encode(DChrono.createDateOrThrow(timestamp))).toStrictEqual(native);
	});

	it.each([0, -3_661_007, 3_661_007, Number.MIN_SAFE_INTEGER + 1, Number.MAX_SAFE_INTEGER - 1])("converts native time value %i", async(value) => {
		const codec = DDataStructure.codecsNativeChrono.definition.time;

		type _CheckCodec = DCommon.ExpectType<
			typeof codec,
			DDataStructure.Codec<DDataStructure.TheTime, number>,
			"strict"
		>;

		expect(await codec.decode(value)).toStrictEqual(DChrono.createTimeOrThrow(value));
		expect(await codec.encode(DChrono.createTimeOrThrow(value))).toBe(value);
	});

	it("rejects invalid native dates during decoding", async() => {
		const codec = DDataStructure.codecsNativeChrono.definition.date;
		const invalidDate = new Date(Number.NaN);

		expect(codec.predicateEncode(invalidDate)).toBe(true);
		expect(await codec.decode(invalidDate)).toBe(DDataStructure.ErrorSymbol);
		expect(DEither.isLeft(DDataStructure.date().decode(
			DDataStructure.codecsNativeChrono,
			invalidDate,
		))).toBe(true);
	});

	it.each([Number.NaN, Infinity, -Infinity, 0.5, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1])("rejects invalid native time %s", async(value) => {
		const codec = DDataStructure.codecsNativeChrono.definition.time;

		expect(codec.predicateEncode(value)).toBe(true);
		expect(await codec.decode(value)).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects incompatible values through structure decoding", () => {
		expect(DEither.isLeft(DDataStructure.date().decode(
			DDataStructure.codecsNativeChrono,
			"2024-01-02T03:04:05.006Z",
		))).toBe(true);
		expect(DEither.isLeft(DDataStructure.time().decode(
			DDataStructure.codecsNativeChrono,
			"3661007",
		))).toBe(true);
	});
});
