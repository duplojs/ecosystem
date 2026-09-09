import { DObject, pipe, type ExpectType } from "@scripts";

describe("getProperty", () => {
	it("should get an object property", () => {
		const source = {
			name: "Duplo",
			version: 1,
		} as const;

		const result = DObject.getProperty(source, "name");
		expect(result).toBe("Duplo");

		type _CheckResult = ExpectType<
			typeof result,
			"Duplo",
			"strict"
		>;
	});

	it("should get an object property in pipe", () => {
		const result = pipe(
			{
				name: "Duplo",
				version: 1,
			} as const,
			DObject.getProperty("version"),
		);

		expect(result).toBe(1);
	});

	it("should merge top level union object keys", () => {
		const source = {
			type: "a",
			value: 1,
		} as {
			type: "a";
			value: number;
		} | {
			type: "b";
			label: string;
		};

		const result = DObject.getProperty(source, "label");
		expect(result).toBeUndefined();

		type _CheckResult = ExpectType<
			typeof result,
			undefined,
			"strict"
		>;
	});
});
