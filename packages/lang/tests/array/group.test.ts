import * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";

describe("group", () => {
	it("should create a group output", () => {
		const result = DArray.groupOutput("small", 1);

		expect(result).toEqual({
			group: "small",
			value: 1,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DArray.GroupOutputResult<"small", number>,
			"strict"
		>;
	});

	it("should create a group output in pipe", () => {
		const result = DCommon.pipe(
			1,
			DArray.groupOutput("small"),
		);

		expect(result).toEqual({
			group: "small",
			value: 1,
		});
	});

	it("should group values", () => {
		const result = DArray.group(
			["a", "bb", "c"] as const,
			(value, params) => params.output(
				value.length === 1 ? "short" : "long",
				value,
			),
		);

		expect(result).toEqual({
			short: ["a", "c"],
			long: ["bb"],
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				readonly long?: readonly ["a" | "bb" | "c", ...("a" | "bb" | "c")[]] | undefined;
				readonly short?: readonly ["a" | "bb" | "c", ...("a" | "bb" | "c")[]] | undefined;
			},
			"strict"
		>;
	});

	it("should group values in pipe", () => {
		const result = DCommon.pipe(
			["a", "bb"] as const,
			DArray.group((value, params) => params.output(
				value.length === 1 ? "short" : "long",
				value,
			)),
		);

		expect(result).toEqual({
			short: ["a"],
			long: ["bb"],
		});
	});

	it.each(["toString", "constructor", "__proto__"])("should group values under the dynamic prototype property name %s", (groupName) => {
		const result = DArray.group(
			[1, 2] as const,
			(value, { output }) => output(groupName, value),
		);

		expect(result).toEqual({ [groupName]: [1, 2] });
		expect(Object.getPrototypeOf(result)).toBeNull();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ readonly [Key in typeof groupName]?: readonly [1 | 2, ...(1 | 2)[]] },
			"strict"
		>;
	});

	it.each(["toString", "constructor", "__proto__"] as const)("should group values under the prototype property name %s in pipe", (groupName) => {
		const result = DCommon.pipe(
			[1, 2] as const,
			DArray.group((value, { output }) => output(groupName, value)),
		);

		expect(result).toEqual({ [groupName]: [1, 2] });
		expect(Object.getPrototypeOf(result)).toBeNull();

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ readonly [Key in typeof groupName]?: readonly [1 | 2, ...(1 | 2)[]] },
			"strict"
		>;
	});

	it("should return an object without a prototype for an empty array", () => {
		const result = DArray.group(
			[] as const,
			(value, { output }) => output("missing", value),
		);

		expect(result).toEqual({});
		expect(Object.getPrototypeOf(result)).toBeNull();
	});
});
