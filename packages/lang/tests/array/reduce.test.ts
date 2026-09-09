import { DArray, pipe, type ExpectType } from "@scripts";

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

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("should reduce values in pipe", () => {
		const result = pipe(
			[1, 2, 3] as const,
			DArray.reduce(0, (params) => params.next(params.lastValue + params.element)),
		);

		expect(result).toBe(6);
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

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
			typeof result,
			{ total: number },
			"strict"
		>;
	});

	it("should reduce from wrapped array value with push helper", () => {
		const result = DArray.reduce(
			["a", "b"] as const,
			DArray.reduceFrom([] as string[]),
			(params) => params.nextPush(params.lastValue, params.element),
		);

		expect(result).toEqual(["a", "b"]);
	});
});
