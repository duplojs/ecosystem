import { DObject, type ExpectType } from "@scripts";

describe("discriminateEntryKey", () => {
	it("should validate an entry key", () => {
		expect(DObject.discriminateEntryKey(["name", "Duplo"], (key) => key === "name")).toBe(true);
		expect(DObject.discriminateEntryKey(["age", 1], (key) => key === "name")).toBe(false);
	});

	it("should narrow an entry from its key", () => {
		const entry = ["name", "Duplo"] as ["name", string] | ["age", number];

		if (DObject.discriminateEntryKey(entry, (key): key is "name" => key === "name")) {
			type _CheckEntry = ExpectType<
				typeof entry,
				["name", string],
				"strict"
			>;
		} else {
			type _CheckEntry = ExpectType<
				typeof entry,
				["age", number],
				"strict"
			>;
		}
	});

	it("should validate an entry key with curried predicate", () => {
		const isNameEntry = DObject.discriminateEntryKey((key: string) => key === "name");

		expect(isNameEntry(["name", "Duplo"])).toBe(true);
		expect(isNameEntry(["age", 1])).toBe(false);
	});
});
