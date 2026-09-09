import { DGenerator, pipe, type ExpectType } from "@scripts";

describe("reduce", () => {
	it("reduces iterable values from a primitive start value", () => {
		const result = DGenerator.reduce(
			[2, 4, 6],
			0,
			(params) => params.next(params.lastValue + params.item + params.index),
		);

		expect(result).toBe(15);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("reduces from a wrapped object value", () => {
		const result = DGenerator.reduce(
			["a", "bb"] as const,
			DGenerator.reduceFrom({ total: 0 }),
			(params) => params.nextWithObject(
				params.lastValue,
				{ total: params.lastValue.total + params.item.length },
			),
		);

		expect(result).toStrictEqual({ total: 3 });

		type _CheckResult = ExpectType<
			typeof result,
			{ total: number },
			"strict"
		>;
	});

	it("pushes values into a wrapped array value", () => {
		const result = DGenerator.reduce(
			["a", "b"] as const,
			DGenerator.reduceFrom([] as string[]),
			(params) => params.nextPush(params.lastValue, params.item),
		);

		expect(result).toStrictEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			string[],
			"strict"
		>;
	});

	it("returns an early exit value", () => {
		const result = DGenerator.reduce(
			[1, 2, 3],
			0,
			(params) => params.item === 2
				? params.exit("stop")
				: params.next(params.lastValue + params.item),
		);

		expect(result).toBe("stop");

		type _CheckResult = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;
	});

	it("reduces values in pipe", () => {
		const result = pipe(
			[1, 2, 3],
			DGenerator.reduce(1, (params) => params.next(params.lastValue * params.item)),
		);

		expect(result).toBe(6);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("preserves item unions inside the reducer callback", () => {
		const input = [1, "a"] as (1 | "a")[];
		const result = DGenerator.reduce(
			input,
			DGenerator.reduceFrom([] as (1 | "a")[]),
			(params) => {
				type _CheckItem = ExpectType<
					typeof params.item,
					1 | "a",
					"strict"
				>;

				return params.nextPush(params.lastValue, params.item);
			},
		);

		expect(result).toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			(1 | "a")[],
			"strict"
		>;
	});
});
