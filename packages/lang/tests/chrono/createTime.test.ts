import { type ExpectType, DChrono, DEither } from "@scripts";

describe("createTime", () => {
	it("creates from milliseconds by default", () => {
		const result = DChrono.createTime(5000);

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe("time5000+");
		}

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("creates from unit seconds", () => {
		const result = DChrono.createTime(2, "second");

		expect(DChrono.serialize(result)).toBe("time2000+");

		type check = ExpectType<
			typeof result,
			DChrono.TheTime,
			"strict"
		>;
	});

	it("creates from a spooling object", () => {
		const input = {
			value: 0,
			week: 1,
			day: 2,
			hour: 3,
			minute: 4,
			second: 5,
			millisecond: 6,
		};

		const total = (input.week * DChrono.millisecondInOneWeek)
			+ (input.day * DChrono.millisecondsInOneDay)
			+ (input.hour * DChrono.millisecondInOneHour)
			+ (input.minute * DChrono.millisecondInOneMinute)
			+ (input.second * DChrono.millisecondsInOneSecond)
			+ input.millisecond;

		const result = DChrono.createTime(input);

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe(`time${total}+`);
		}

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("creates from a spooling number value", () => {
		const result = DChrono.createTime({
			value: 2500,
			second: 1,
		});

		expect(result).toStrictEqual(
			DEither.right("time-created", DChrono.createTimeOrThrow(3500)),
		);
	});

	it("creates from a spooling TheTime value", () => {
		const value = DChrono.createTime(2500, "millisecond");
		const result = DChrono.createTime({
			value,
			second: 1,
		});

		expect(result).toStrictEqual(
			DEither.right("time-created", DChrono.createTimeOrThrow(3500)),
		);
	});

	it("creates from a spooling positive serialized time value", () => {
		const result = DChrono.createTime({
			value: "time2500+",
			second: 1,
		});

		expect(result).toStrictEqual(
			DEither.right("time-created", DChrono.createTimeOrThrow(3500)),
		);
	});

	it("creates from a spooling negative serialized time value", () => {
		const result = DChrono.createTime({
			value: "time2500-",
			second: 1,
		});

		expect(result).toStrictEqual(
			DEither.right("time-created", DChrono.createTimeOrThrow(-1500)),
		);
	});

	it("creates from ISO time value", () => {
		const input = {
			value: "01:02:03.004",
		};

		const total = (DChrono.millisecondInOneHour)
			+ (2 * DChrono.millisecondInOneMinute)
			+ (3 * DChrono.millisecondsInOneSecond)
			+ 4;

		const result = DChrono.createTime(input);

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe(`time${total}+`);
		}

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("creates from ISO time value without milliseconds", () => {
		const input = {
			value: "02:30:15Z",
		};

		const total = (2 * DChrono.millisecondInOneHour)
			+ (30 * DChrono.millisecondInOneMinute)
			+ (15 * DChrono.millisecondsInOneSecond);

		const result = DChrono.createTime(input);

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe(`time${total}+`);
		}

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("creates from negative ISO time value", () => {
		const input = {
			value: "-10:00",
		};

		const total = 10 * DChrono.millisecondInOneHour;
		const result = DChrono.createTime(input);

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe(`time${total}-`);
		}

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("returns an error for an invalid spooling time value", () => {
		const input = {
			value: "invalid",
			minute: 1,
		};

		const result = DChrono.createTime(input);

		expect(result).toStrictEqual(
			DEither.left("time-created-error", null),
		);

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("returns an error for a missing spooling time value", () => {
		const result = DChrono.createTime({});

		expect(result).toStrictEqual(
			DEither.left("time-created-error", null),
		);
	});

	it("returns an error for an unsafe spooling time value", () => {
		const result = DChrono.createTime({
			value: DChrono.maxTimeValue,
		});

		expect(result).toStrictEqual(
			DEither.left("time-created-error", null),
		);
	});

	it("returns an error when spooling offsets produce an unsafe time", () => {
		const result = DChrono.createTime({
			value: DChrono.maxTimeValue - 1,
			millisecond: 2,
		});

		expect(result).toStrictEqual(
			DEither.left("time-created-error", null),
		);
	});

	it("creates with negative milliseconds", () => {
		const result = DChrono.createTime(-2500);

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe("time2500-");
		}

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("creates from negative serialized time", () => {
		const result = DChrono.createTime("time2500-");

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe("time2500-");
		}
	});

	it("creates from positive serialized time", () => {
		const result = DChrono.createTime("time2500+");

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DChrono.serialize(DEither.unwrapRight(result))).toBe("time2500+");
		}
	});

	it("returns an error for NaN", () => {
		const result = DChrono.createTime(Number.NaN);

		expect(result).toStrictEqual(
			DEither.left("time-created-error", null),
		);

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("returns an error for invalid string date", () => {
		const result = DChrono.createTime("not-a-time" as never);

		expect(result).toStrictEqual(
			DEither.left("time-created-error", null),
		);

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("returns an error for unsafe time value", () => {
		const result = DChrono.createTime(DChrono.maxTimeValue);

		expect(result).toStrictEqual(
			DEither.left("time-created-error", null),
		);

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("returns TheTime for TheTime input", () => {
		const time = DChrono.createTime(1, "second");
		const result = DChrono.createTime(time);

		expect(result).toBe(time);

		type check = ExpectType<
			typeof result,
			DChrono.MayBeTime,
			"strict"
		>;
	});

	it("creates from every supported unit", () => {
		expect(DChrono.createTime(2, "millisecond").toNative()).toBe(2);
		expect(DChrono.createTime(2, "second").toNative()).toBe(2 * DChrono.millisecondsInOneSecond);
		expect(DChrono.createTime(2, "minute").toNative()).toBe(2 * DChrono.millisecondInOneMinute);
		expect(DChrono.createTime(2, "hour").toNative()).toBe(2 * DChrono.millisecondInOneHour);
		expect(DChrono.createTime(2, "day").toNative()).toBe(2 * DChrono.millisecondsInOneDay);
		expect(DChrono.createTime(2, "week").toNative()).toBe(2 * DChrono.millisecondInOneWeek);
	});

	it("type safe with createTime", () => {
		DChrono.createTime(1, "millisecond");
		DChrono.createTime(9007199254740990, "millisecond");
		DChrono.createTime(-9007199254740990, "millisecond");

		DChrono.createTime(1, "second");
		DChrono.createTime(9007199254739, "second");
		DChrono.createTime(-9007199254739, "second");

		DChrono.createTime(1, "minute");
		DChrono.createTime(150119987578, "minute");
		DChrono.createTime(-150119987578, "minute");

		DChrono.createTime(1, "hour");
		DChrono.createTime(2501999791, "hour");
		DChrono.createTime(-2501999791, "hour");

		DChrono.createTime(1, "day");
		DChrono.createTime(104249990, "day");
		DChrono.createTime(-104249990, "day");

		DChrono.createTime(1, "week");
		DChrono.createTime(14892854, "week");
		DChrono.createTime(-14892854, "week");

		DChrono.createTime(
			// @ts-expect-error expects literal value
			11 as number,
			"second",
		);

		DChrono.createTime(
			// @ts-expect-error greater than millisecond limit
			9007199254740992,
			"millisecond",
		);

		DChrono.createTime(
			// @ts-expect-error less than millisecond limit
			-9007199254740992,
			"millisecond",
		);

		DChrono.createTime(
			// @ts-expect-error greater than second limit
			9007199254741,
			"second",
		);

		DChrono.createTime(
			// @ts-expect-error less than second limit
			-9007199254741,
			"second",
		);

		DChrono.createTime(
			// @ts-expect-error greater than minute limit
			150119987580,
			"minute",
		);

		DChrono.createTime(
			// @ts-expect-error less than minute limit
			-150119987580,
			"minute",
		);

		DChrono.createTime(
			// @ts-expect-error greater than hour limit
			2501999793,
			"hour",
		);

		DChrono.createTime(
			// @ts-expect-error less than hour limit
			-2501999793,
			"hour",
		);

		DChrono.createTime(
			// @ts-expect-error greater than day limit
			104249992,
			"day",
		);

		DChrono.createTime(
			// @ts-expect-error less than day limit
			-104249992,
			"day",
		);

		DChrono.createTime(
			// @ts-expect-error greater than week limit
			14892856,
			"week",
		);

		DChrono.createTime(
			// @ts-expect-error less than week limit
			-14892856,
			"week",
		);
	});
});
