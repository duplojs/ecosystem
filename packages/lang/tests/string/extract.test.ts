import { DString, pipe, type ExpectType } from "@scripts";

describe("extract", () => {
	it("should extract a match with groups", () => {
		const result = DString.extract(
			"price: 12 EUR",
			/(\d+) (?<currency>[A-Z]+)/,
		);

		expect(result).toEqual({
			matchedValue: "12 EUR",
			groups: ["12", "EUR"],
			namedGroups: { currency: "EUR" },
			offset: 7,
			self: "price: 12 EUR",
		});

		type _CheckResult = ExpectType<
			typeof result,
			DString.ExtractOutput<"price: 12 EUR"> | undefined,
			"strict"
		>;
	});

	it("should extract a match in pipe", () => {
		const result = pipe(
			"user-42",
			DString.extract(/\d+/),
		);

		expect(result).toEqual({
			matchedValue: "42",
			groups: [],
			namedGroups: {},
			offset: 5,
			self: "user-42",
		});
	});

	it("should return undefined when pattern does not match", () => {
		expect(DString.extract("user", /\d+/)).toBeUndefined();
	});

	it("should fallback to the input string when match details are missing", () => {
		const nativeMatch = String.prototype.match;

		try {
			String.prototype.match = () => ["user"] as RegExpMatchArray;

			expect(DString.extract("user", /user/)).toEqual({
				matchedValue: "user",
				groups: [],
				namedGroups: {},
				offset: 0,
				self: "user",
			});
		} finally {
			String.prototype.match = nativeMatch;
		}
	});
});
