import * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";

describe("has", () => {
	it("checks that an input has every requested kind", () => {
		const firstKind = DKind.create<"first", "one">("first");
		const secondKind = DKind.create<"second", "two">("second");
		const firstOnly = firstKind.addTo({ name: "first" as const }, "one");
		const both = secondKind.addTo(firstOnly, "two");

		expect(DKind.has(both, [firstKind, secondKind])).toBe(true);
		expect(DKind.has(firstOnly, [firstKind, secondKind])).toBe(false);
	});

	it("narrows inputs with the direct signature", () => {
		const firstKind = DKind.create<"direct-first", "one">("direct-first");
		const secondKind = DKind.create<"direct-second", "two">("direct-second");
		const first = firstKind.addTo({ name: "first" as const }, "one");
		const both = secondKind.addTo(first, "two");
		const plain = { name: "plain" as const };
		const input: typeof both | typeof first | typeof plain = both;

		if (DKind.has(input, [firstKind, secondKind])) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				typeof both,
				"strict"
			>;

			expect(secondKind.getValue(input)).toBe("two");
		}
	});

	it("narrows inputs with the curried signature in a pipe", () => {
		const firstKind = DKind.create<"pipe-first", "one">("pipe-first");
		const secondKind = DKind.create<"pipe-second", "two">("pipe-second");
		const first = firstKind.addTo({ name: "first" as const }, "one");
		const both = secondKind.addTo(first, "two");
		const input: typeof both | typeof first = both;

		const result = DCommon.pipe(
			input,
			DCommon.when(
				DKind.has([firstKind, secondKind]),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						typeof both,
						"strict"
					>;

					return secondKind.getValue(value);
				},
			),
		);

		expect(result).toBe("two");
	});
});
