import { DObject, pipe, when, type ExpectType } from "@scripts";

describe("deepDiscriminate", () => {
	it("should discriminate an object from a nested property", () => {
		type Source =
			| {
				profile: { role: "admin" };
				enabled: true;
			}
			| {
				profile: { role: "user" };
				enabled: false;
			};

		const source = {
			profile: { role: "admin" },
			enabled: true,
		} as Source;

		if (DObject.deepDiscriminate(source, "profile.role", "admin")) {
			expect(source.enabled).toBe(true);

			type _CheckSource = ExpectType<
				typeof source,
				{
					profile: { role: "admin" };
					enabled: true;
				},
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				{
					profile: { role: "user" };
					enabled: false;
				},
				"strict"
			>;
		}
	});

	it("should reject an object with a different nested property", () => {
		const source = {
			profile: { role: "user" as "admin" | "user" },
		} as const;

		expect(DObject.deepDiscriminate(source, "profile.role", "admin")).toBe(false);
	});

	it("should discriminate with a list of nested values in pipe", () => {
		const source = {
			profile: { role: "admin" },
		} as const;

		const result = pipe(
			source,
			when(
				DObject.deepDiscriminate("profile.role", ["admin"]),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						{ readonly profile: { readonly role: "admin" } },
						"strict"
					>;

					return value.profile.role;
				},
			),
		);

		expect(result).toBe("admin");
	});
});
