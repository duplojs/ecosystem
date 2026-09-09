import { DArray, pipe, type ExpectType } from "@scripts";

describe("group", () => {
	it("should create a group output", () => {
		const result = DArray.groupOutput("small", 1);

		expect(result).toEqual({
			group: "small",
			value: 1,
		});

		type _CheckResult = ExpectType<
			typeof result,
			DArray.GroupOutputResult<"small", number>,
			"strict"
		>;
	});

	it("should create a group output in pipe", () => {
		const result = pipe(
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

		type _CheckResult = ExpectType<
			typeof result,
			{
				readonly long?: readonly ["a" | "bb" | "c", ...("a" | "bb" | "c")[]] | undefined;
				readonly short?: readonly ["a" | "bb" | "c", ...("a" | "bb" | "c")[]] | undefined;
			},
			"strict"
		>;
	});

	it("should group values in pipe", () => {
		const result = pipe(
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
});
