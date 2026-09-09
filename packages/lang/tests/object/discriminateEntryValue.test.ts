import { DObject, type ExpectType } from "@scripts";

describe("discriminateEntryValue", () => {
	it("should validate an entry value", () => {
		expect(DObject.discriminateEntryValue(["name", "Duplo"], (value) => value === "Duplo")).toBe(true);
		expect(DObject.discriminateEntryValue(["name", "Lang"], (value) => value === "Duplo")).toBe(false);
	});

	it("should narrow an entry from its value", () => {
		const entry = ["value", "Duplo"] as ["value", string] | ["value", number];

		if (DObject.discriminateEntryValue(entry, (value): value is string => typeof value === "string")) {
			type _CheckEntry = ExpectType<
				typeof entry,
				["value", string],
				"strict"
			>;
		} else {
			type _CheckEntry = ExpectType<
				typeof entry,
				["value", number],
				"strict"
			>;
		}
	});

	it("should validate an entry value with curried predicate", () => {
		const hasStringValue = DObject.discriminateEntryValue((value: unknown): value is string => typeof value === "string");

		expect(hasStringValue(["name", "Duplo"])).toBe(true);
		expect(hasStringValue(["age", 1])).toBe(false);
	});
});
