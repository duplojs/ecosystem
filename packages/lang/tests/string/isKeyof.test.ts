import { DString, pipe, when, type ExpectType } from "@scripts";

describe("isKeyof", () => {
	it("should validate a key with a defined value", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};

		expect(DString.isKeyof("name", source)).toBe(true);
		expect(DString.isKeyof("missing", source)).toBe(false);
	});

	it("should consider a key with undefined value as missing", () => {
		const source = {
			name: undefined,
		};

		expect(DString.isKeyof("name", source)).toBe(false);
	});

	it("should narrow a key inside a pipe when callback", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};
		const key = "name" as "name" | "missing";
		const result = pipe(
			key,
			when(
				DString.isKeyof(source),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						"name",
						"strict"
					>;

					return source[value];
				},
			),
		);

		expect(result).toBe("Duplo");
	});

	it("should narrow the key to object keys when the value is defined", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};
		const key = "name" as "name" | "missing";

		if (DString.isKeyof(key, source)) {
			type _CheckKey = ExpectType<
				typeof key,
				"name",
				"strict"
			>;
		} else {
			type _CheckKey = ExpectType<
				typeof key,
				"missing",
				"strict"
			>;
		}
	});
});
