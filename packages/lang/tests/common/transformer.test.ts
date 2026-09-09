import { DCommon, type ExpectType, pipe } from "@scripts";

describe("transformer", () => {
	it("applies the target method when present", () => {
		const result = DCommon.transformer(
			{
				value: 1,
				toNative() {
					return { done: true as const };
				},
			},
			"toNative",
		);

		type _CheckResult = ExpectType<
			typeof result,
			{ done: true },
			"strict"
		>;

		expect(result).toStrictEqual({ done: true });
	});

	it("recursively transforms plain objects and arrays", () => {
		const result = DCommon.transformer(
			{
				first: {
					toNative() {
						return 1 as const;
					},
				},
				second: [
					{
						toNative() {
							return "x" as const;
						},
					},
					"keep",
				],
				third: {
					deep: {
						toNative() {
							return { ok: true as const };
						},
					},
				},
			},
			"toNative",
		);

		expect(result).toStrictEqual({
			first: 1,
			second: ["x", "keep"],
			third: {
				deep: { ok: true },
			},
		});
	});

	it("keeps non-plain objects without the target method", () => {
		class Box {
			public constructor(
				public value: number,
			) {}
		}

		const input = new Box(12);

		expect(DCommon.transformer(input, "toNative")).toBe(input);
	});

	it("creates reusable transformers", () => {
		const toNative = DCommon.createTransformer("toNative");
		const result = pipe(
			{
				toNative() {
					return 42 as const;
				},
			},
			toNative,
		);

		type _CheckResult = ExpectType<
			typeof result,
			42,
			"strict"
		>;

		expect(result).toBe(42);
	});

	it("exposes toJSON and toNative transformers", () => {
		expect(DCommon.toJSON({
			toJSON() {
				return "json" as const;
			},
		})).toBe("json");
		expect(DCommon.toNative({
			toNative() {
				return "native" as const;
			},
		})).toBe("native");
	});
});
