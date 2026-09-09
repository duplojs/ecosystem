import { DString, type ExpectType } from "@scripts";

describe("isEmail", () => {
	it("should validate an email", () => {
		expect(DString.isEmail("contact@example.com")).toBe(true);
		expect(DString.isEmail("contact.example.com")).toBe(false);
	});

	it("should reject emails with invalid dot placement", () => {
		expect(DString.isEmail(".contact@example.com")).toBe(false);
		expect(DString.isEmail("contact..team@example.com")).toBe(false);
	});

	it("should narrow the string with an email constraint", () => {
		const source = "contact@example.com" as string;

		if (DString.isEmail(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.Email,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});
});
