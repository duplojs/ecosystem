import { DKind, type ExpectType, pipe, when } from "@scripts";

describe("hasSome", () => {
	it("checks that an input has at least one requested kind", () => {
		const firstKind = DKind.create<"some-first", "one">("some-first");
		const secondKind = DKind.create<"some-second", "two">("some-second");
		const first = firstKind.addTo({ name: "first" as const }, "one");
		const plain = { name: "plain" as const };

		expect(DKind.hasSome(first, [firstKind, secondKind])).toBe(true);
		expect(DKind.hasSome(plain, [firstKind, secondKind])).toBe(false);
	});

	it("narrows inputs with the direct signature", () => {
		const firstKind = DKind.create<"some-direct-first", "one">("some-direct-first");
		const secondKind = DKind.create<"some-direct-second", "two">("some-direct-second");
		const first = firstKind.addTo({ name: "first" as const }, "one");
		const second = secondKind.addTo({ name: "second" as const }, "two");
		const plain = { name: "plain" as const };
		const input = first as typeof first | typeof second | typeof plain;

		if (DKind.hasSome(input, [firstKind, secondKind])) {
			type _CheckInput = ExpectType<
				typeof input,
				typeof first | typeof second,
				"strict"
			>;

			expect(input.name).not.toBe("plain");
		}
	});

	it("narrows inputs with the curried signature in a pipe", () => {
		const firstKind = DKind.create<"some-pipe-first", "one">("some-pipe-first");
		const secondKind = DKind.create<"some-pipe-second", "two">("some-pipe-second");
		const first = firstKind.addTo({ name: "first" as const }, "one");
		const input: typeof first | { name: "plain" } = first;

		const result = pipe(
			input,
			when(
				DKind.hasSome([firstKind, secondKind]),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						typeof first,
						"strict"
					>;

					return value.name;
				},
			),
		);

		expect(result).toBe("first");
	});
});
