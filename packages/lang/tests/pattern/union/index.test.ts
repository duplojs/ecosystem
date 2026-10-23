import * as DCommon from "@scripts/common";
import * as DPattern from "@scripts/pattern";
import * as DString from "@scripts/string";

describe("union", () => {
	interface Test {
		type: "test" | "toto" | "tata" | {
			tt: "yy" | "oo";
			sub: "ta";
		};
	}

	it("match", () => {
		const input: Test = {
			type: "tata",
		} as Test;

		const result = DCommon.pipe(
			input,
			DPattern.match(
				{ type: DPattern.union("tata", { tt: "oo" }) },
				(value) => {
					type Check = DCommon.ExpectType<
						typeof value,
						{
							type: "tata" | {
								tt: "oo";
								sub: "ta";
							};
						},
						"strict"
					>;
					return "myValue";
				},
			),
		);

		expect(result).toStrictEqual(DPattern.result("myValue"));

		type Check = DCommon.ExpectType<
			typeof result,
			DPattern.PatternResult<"myValue"> | {
				type: "test" | "toto" | {
					sub: "ta";
					tt: "yy";
				};
			},
			"strict"
		>;
	});

	it("other match", () => {
		const input: Test = {
			type: "tata",
		} as Test;

		const result = DCommon.pipe(
			input,
			DPattern.match(
				{ type: DPattern.union("tata", "test") },
				(value) => {
					type Check = DCommon.ExpectType<
						typeof value,
						{
							type: "tata" | "test";
						},
						"strict"
					>;
					return "myValue";
				},
			),
		);

		expect(result).toStrictEqual(DPattern.result("myValue"));

		type Check = DCommon.ExpectType<
			typeof result,
			DPattern.PatternResult<"myValue"> | {
				type: "toto" | {
					sub: "ta";
					tt: "yy" | "oo";
				};
			},
			"strict"
		>;
	});

	it("not match", () => {
		const input: Test = {
			type: "tata",
		} as Test;

		const result = DPattern.match(
			input,
			DCommon.forward({ type: DPattern.union("test", "toto") }),
			(value) => {
				type Check = DCommon.ExpectType<
					typeof value,
					{
						type: "test" | "toto";
					},
					"strict"
				>;

				return "myValue";
			},
		);

		expect(result).toStrictEqual(input);

		type Check = DCommon.ExpectType<
			typeof result,
			DPattern.PatternResult<"myValue"> | {
				type: "tata" | {
					sub: "ta";
					tt: "yy" | "oo";
				};
			},
			"strict"
		>;
	});

	it("other match", () => {
		const input: Test = {
			type: "tata",
		} as Test;

		const result = DCommon.pipe(
			input,
			DPattern.match(
				DPattern.union(
					{ type: "tata" },
					{ type: "test" },
				),
				(value) => {
					type Check = DCommon.ExpectType<
						typeof value,
						{
							type: "tata";
						} | {
							type: "test";
						},
						"strict"
					>;
					return "myValue";
				},
			),
		);

		expect(result).toStrictEqual(DPattern.result("myValue"));

		type Check = DCommon.ExpectType<
			typeof result,
			DPattern.PatternResult<"myValue"> | {
				type: "toto" | {
					sub: "ta";
					tt: "yy" | "oo";
				};
			},
			"strict"
		>;
	});

	it("match on maybe all", () => {
		const result = DPattern.match(
			"one" as "one" | "two",
			DPattern.union(
				(value) => {
					type Check = DCommon.ExpectType<
						typeof value,
						"one" | "two",
						"strict"
					>;

					return true;
				},
				"one",
			),
			(value) => {
				type Check = DCommon.ExpectType<
						typeof value,
						"one" | "two",
						"strict"
				>;

				return "myValue";
			},
		);

		expect(result).toStrictEqual(DPattern.result("myValue"));

		type Check = DCommon.ExpectType<
				typeof result,
				"one" | "two" | DPattern.PatternResult<"myValue">,
				"strict"
		>;
	});

	it("match on predicate", () => {
		const result = DPattern.match(
			"one" as "one" | "two",
			DPattern.union(
				DString.startsWith("o"),
				"two",
			),
			(value) => {
				type Check = DCommon.ExpectType<
						typeof value,
						"one" | "two",
						"strict"
				>;

				return "myValue";
			},
		);

		expect(result).toStrictEqual(DPattern.result("myValue"));

		type Check = DCommon.ExpectType<
				typeof result,
				DPattern.PatternResult<"myValue">,
				"strict"
		>;
	});
});
