import * as DObject from "@scripts/object";
import * as DCommon from "@scripts/common";

describe("pick", () => {
	it("should pick keys from an array", () => {
		const source = {
			name: "Duplo",
			version: 1,
			enabled: true,
		} as const;

		const result = DObject.pick(source, ["name", "enabled"] as const);
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

	it("should pick keys from an object matcher", () => {
		const result = DObject.pick(
			{
				name: "Duplo",
				version: 1,
				enabled: true,
			},
			{
				name: true,
				enabled: false,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
		});
	});

	it("should pick keys in pipe", () => {
		const result = DCommon.pipe(
			{
				name: "Duplo",
				version: 1,
			} as const,
			DObject.pick(["version"] as const),
		);

		expect(result).toEqual({
			version: 1,
		});
	});

	it("should preserve a selected symbol property as guaranteed by its return type", () => {
		const key = Symbol("value");
		const input = {
			name: "Duplo",
			[key]: 42,
		};

		const result = DObject.pick(input, [key]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ [key]: number },
			"strict"
		>;

		expect(result).toStrictEqual({ [key]: 42 });
	});

	it("should select symbol properties with an object matcher", () => {
		const selected = Symbol("value");
		const excluded = Symbol("value");
		const result = DObject.pick(
			{
				[selected]: 42,
				[excluded]: 24,
			},
			{
				[selected]: true,
				[excluded]: false,
			},
		);

		expect(result).toStrictEqual({ [selected]: 42 });

		type _CheckResult = DCommon.ExpectType<typeof result, { [selected]: number }, "strict">;
	});

	it("should select numeric and symbol keys in pipe", () => {
		const key = Symbol("value");
		const input = {
			0: "zero",
			name: "Duplo",
			[key]: 42,
		};
		const result = DCommon.pipe(
			input,
			DObject.pick([0, key]),
		);

		expect(result).toStrictEqual({
			0: "zero",
			[key]: 42,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				0: string;
				[key]: number;
			},
			"strict"
		>;
	});
});
