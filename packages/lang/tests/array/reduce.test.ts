import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";

describe("reduce", () => {
	it("should reduce values from an initial value", () => {
		const source = [1, 2, 3] as const;
		const result = DArray.reduce(
			source,
			0,
			(params) => {
				expect(params.self).toBe(source);
				return params.next(params.lastValue + params.element);
			},
		);

		expect(result).toBe(6);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("should exit early", () => {
		const result = DArray.reduce(
			[1, 2, 3],
			0,
			(params) => params.element === 2
				? params.exit("stop")
				: params.next(params.lastValue + params.element),
		);

		expect(result).toBe("stop");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("should reduce from wrapped value with object helpers", () => {
		const result = DArray.reduce(
			["a", "bb"] as const,
			DArray.reduceFrom({ total: 0 }),
			(params) => params.nextWithObject(
				params.lastValue,
				{ total: params.lastValue.total + params.element.length },
			),
		);

		expect(result).toEqual({ total: 3 });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ total: number },
			"strict"
		>;
	});

	it("should reduce from wrapped array value with push helper", () => {
		const result = DArray.reduce(
			["a", "b"] as const,
			DArray.reduceFrom<readonly string[]>([]),
			(params) => params.nextPush(params.lastValue, params.element),
		);

		expect(result).toEqual(["a", "b"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly string[],
			"strict"
		>;
	});

	it("should reject a push result incompatible with a tuple accumulator", () => {
		DArray.reduce(
			[1] as const,
			DArray.reduceFrom([1] as const),
			// @ts-expect-error pushing widens the result beyond the tuple accumulator.
			(params) => {
				const result = params.nextPush(params.lastValue, params.element);

				expect(result).toStrictEqual({ "-next": [1, 1] });

				type _CheckResult = DCommon.ExpectType<
					typeof result,
					DArray.ReduceNext<readonly 1[]>,
					"strict"
				>;

				return result;
			},
		);
	});

	it("should skip empty spreads between non-empty spreads in pipe", () => {
		const result = DCommon.pipe(
			[[], [1, 2], [], [3], []],
			DArray.reduce(
				DArray.reduceFrom<readonly number[]>([]),
				(params) => params.nextPush(params.lastValue, ...params.element),
			),
		);

		expect(result).toStrictEqual([1, 2, 3]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly number[],
			"strict"
		>;
	});
});
