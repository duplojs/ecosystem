import { DObject, pipe, when, type ExpectType } from "@scripts";

describe("hasKeys", () => {
	it("should validate a defined key", () => {
		expect(DObject.hasKeys({ name: "Duplo" }, "name")).toBe(true);
		expect(DObject.hasKeys({ name: undefined }, "name")).toBe(false);
	});

	it("should validate all keys", () => {
		expect(DObject.hasKeys({
			name: "Duplo",
			version: 1,
		}, ["name", "version"])).toBe(true);
		expect(DObject.hasKeys({
			name: "Duplo",
			version: undefined,
		}, ["name", "version"])).toBe(false);
	});

	it("should narrow required keys on both branches", () => {
		const source = {
			name: "Duplo",
			version: 1,
		} as {
			name?: string;
			version?: number;
		};

		if (DObject.hasKeys(source, ["name", "version"])) {
			type _CheckSource = ExpectType<
				typeof source,
				{
					name: string;
					version: number;
				},
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				{
					name?: string;
					version?: number;
				},
				"strict"
			>;
		}
	});

	it("should narrow required keys in pipe", () => {
		const source = {
			name: "Duplo",
			version: 1,
		} as {
			name?: string;
			version?: number;
		};

		const result = pipe(
			source,
			when(
				DObject.hasKeys(["name", "version"]),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						{
							name: string;
							version: number;
						},
						"strict"
					>;

					return value.version;
				},
			),
		);

		expect(result).toBe(1);
	});
});
