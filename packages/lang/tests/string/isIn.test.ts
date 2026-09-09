import { DString, pipe, when, type ExpectType } from "@scripts";

describe("isIn", () => {
	it("should validate a string contained in an array", () => {
		const values = ["draft", "published"] as const;

		expect(DString.isIn("draft", values)).toBe(true);
		expect(DString.isIn("archived", values)).toBe(false);
	});

	it("should narrow a string contained in an array inside a pipe when callback", () => {
		const source = "draft" as string;
		const result = pipe(
			source,
			when(
				DString.isIn(["draft", "published"] as const),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						"draft" | "published",
						"strict"
					>;

					return "published";
				},
			),
		);

		expect(result).toBe("published");
	});

	it("should narrow the string to array values", () => {
		const source = "draft" as "draft" | "archived";

		if (DString.isIn(source, ["draft", "published"] as const)) {
			type _CheckSource = ExpectType<
				typeof source,
				"draft",
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				"archived",
				"strict"
			>;
		}
	});
});
