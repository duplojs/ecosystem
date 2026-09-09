import { DCommon, DDataStructure, DModeling, type ExpectType, pipe, when } from "@scripts";

describe("isType", () => {
	it("detects every supported runtime type", () => {
		const asyncIterable: AsyncIterable<string> = {
			[Symbol.asyncIterator]() {
				return {
					next: () => Promise.resolve({
						done: true,
						value: undefined,
					}),
				};
			},
		};
		const cases = [
			["value", "string"],
			[1, "number"],
			[true, "boolean"],
			[() => undefined, "function"],
			[1n, "bigint"],
			[undefined, "undefined"],
			[null, "null"],
			[Symbol("value"), "symbol"],
			[{}, "object"],
			[new Set(), "iterable"],
			[asyncIterable, "asyncIterable"],
			[[], "array"],
		] as const;

		for (const [input, type] of cases) {
			expect(DCommon.isType(input, type)).toBe(true);
		}
	});

	it("rejects values outside object and iterable runtime types", () => {
		const cases = [
			[null, "object"],
			["value", "object"],
			[[], "object"],
			[new Set(), "object"],
			[null, "iterable"],
			["value", "iterable"],
			[{}, "iterable"],
			[{ [Symbol.iterator]: null }, "iterable"],
			[null, "asyncIterable"],
			["value", "asyncIterable"],
			[{}, "asyncIterable"],
			[{ [Symbol.asyncIterator]: null }, "asyncIterable"],
		] as const;

		for (const [input, type] of cases) {
			expect(
				DCommon.isType(
					input as typeof input | AsyncIterable<unknown>,
					type,
				),
			).toBe(false);
		}
	});

	it("narrows the direct input", () => {
		const format = (input: string | number) => {
			if (DCommon.isType(input, "string")) {
				type _CheckInput = ExpectType<
					typeof input,
					string,
					"strict"
				>;

				return input.toUpperCase();
			} else {
				type _CheckInput = ExpectType<
					typeof input,
					number,
					"strict"
				>;

				return input.toFixed(2);
			}
		};

		expect(format("value")).toBe("VALUE");
		expect(format(42)).toBe("42.00");
	});

	it("preserves narrowing in a pipe", () => {
		const result = pipe(
			"value" as string | number,
			when(
				DCommon.isType("string"),
				(input) => {
					type _CheckInput = ExpectType<
						typeof input,
						string,
						"strict"
					>;

					return input.length;
				},
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(5);
	});

	it("accepts a direct decodeMap result", () => {
		const name = DModeling.NewTypeStructure(
			"user-name",
			DDataStructure.string(),
			[],
		);
		const result = DCommon.isType(
			name.decodeMap(
				DDataStructure.createCodecs({}),
				"Jane",
			),
			"object",
		);

		type _CheckResult = ExpectType<
			typeof result,
			boolean,
			"strict"
		>;

		expect(result).toBe(true);
	});
});
