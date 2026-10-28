import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("replaceAll", () => {
	it("should replace all matching strings", () => {
		const result = DString.replaceAll("hello hello", "hello", "hi");

		expect(result).toBe("hi hi");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should replace all matching strings in pipe", () => {
		const result = DCommon.pipe(
			"hello hello",
			DString.replaceAll("hello", "hi"),
		);

		expect(result).toBe("hi hi");
	});

	it("should convert a non-global regex to a global regex", () => {
		expect(DString.replaceAll("item-1 item-2", /item/, "product")).toBe(
			"product-1 product-2",
		);
	});

	it("should reuse a global regex", () => {
		expect(DString.replaceAll("item-1 item-2", /item/g, "product")).toBe(
			"product-1 product-2",
		);
	});

	it("should call replacer with match details", () => {
		const calls: unknown[] = [];

		const result = DString.replaceAll(
			"price: 12 EUR, tax: 3 EUR",
			/(\d+) (?<currency>[A-Z]+)/,
			(params) => {
				calls.push(params);

				type _CheckSelf = DCommon.ExpectType<
					typeof params.self,
					"price: 12 EUR, tax: 3 EUR",
					"strict"
				>;

				type _CheckNamedGroups = DCommon.ExpectType<
					typeof params.namedGroups,
					Record<string, string | undefined>,
					"strict"
				>;

				return `${params.groups[0]} ${params.namedGroups.currency?.toLowerCase()}`;
			},
		);

		expect(result).toBe("price: 12 eur, tax: 3 eur");
		expect(calls).toEqual([
			{
				matchedValue: "12 EUR",
				groups: ["12", "EUR"],
				namedGroups: { currency: "EUR" },
				offset: 7,
				self: "price: 12 EUR, tax: 3 EUR",
			},
			{
				matchedValue: "3 EUR",
				groups: ["3", "EUR"],
				namedGroups: { currency: "EUR" },
				offset: 20,
				self: "price: 12 EUR, tax: 3 EUR",
			},
		]);
	});

	it("should call replacer without named groups", () => {
		const result = DString.replaceAll(
			"item-42 item-43",
			/(\d+)/,
			(params) => {
				expect(params.namedGroups).toEqual({});

				return `${params.matchedValue}:${Object.keys(params.namedGroups).length}`;
			},
		);

		expect(result).toBe("item-42:0 item-43:0");
	});
});
