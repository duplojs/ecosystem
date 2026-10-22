import * as DObject from "@scripts/object";
import * as DCommon from "@scripts/common";

describe("omit", () => {
	it("should omit keys from an array", () => {
		const source = {
			name: "Duplo",
			version: 1,
			enabled: true,
		} as const;

		const result = DObject.omit(source, ["version"] as const);
		expect(result).toEqual({
			name: "Duplo",
			enabled: true,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				readonly name: "Duplo";
				readonly enabled: true;
			},
			"strict"
		>;
	});

	it("should omit keys from an object matcher", () => {
		const result = DObject.omit(
			{
				name: "Duplo",
				version: 1,
				enabled: true,
			},
			{
				version: true,
				enabled: false,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
			enabled: true,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				name: string;
				enabled: boolean;
			},
			"strict"
		>;
	});

	it("should omit keys in pipe", () => {
		const result = DCommon.pipe(
			{
				name: "Duplo",
				version: 1,
			} as const,
			DObject.omit(["version"] as const),
		);

		expect(result).toEqual({
			name: "Duplo",
		});
	});

	it("should preserve an unselected symbol property as guaranteed by its return type", () => {
		const key = Symbol("value");
		const input = {
			name: "Duplo",
			[key]: 42,
		};

		const result = DObject.omit(input, ["name"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ [key]: number },
			"strict"
		>;

		expect(result).toStrictEqual({ [key]: 42 });
	});

	it("should omit symbol properties with an object matcher", () => {
		const removed = Symbol("value");
		const retained = Symbol("value");
		const input = {
			[removed]: 42,
			[retained]: 24,
		};
		const result = DObject.omit(input, {
			[removed]: true,
			[retained]: false,
		});

		expect(result).toStrictEqual({ [retained]: 24 });
		expect(input).toStrictEqual({
			[removed]: 42,
			[retained]: 24,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, { [retained]: number }, "strict">;
	});

	it("should omit numeric and symbol keys in pipe", () => {
		const key = Symbol("value");
		const input = {
			0: "zero",
			name: "Duplo",
			[key]: 42,
		};
		const result = DCommon.pipe(
			input,
			DObject.omit([0, key]),
		);

		expect(result).toStrictEqual({ name: "Duplo" });

		type _CheckResult = DCommon.ExpectType<typeof result, { name: string }, "strict">;
	});
});
