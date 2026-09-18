import { createMetadata, metadataKind } from "@core/metadata";

describe("metadata base", () => {
	it("creates metadata with name and value", () => {
		const alpha = createMetadata<"alpha", string>("alpha");
		const meta = alpha("value");

		expect(alpha.dataName).toBe("alpha");
		expect(alpha.is(meta)).toBe(true);
		expect(metadataKind.has(meta)).toBe(true);
		expect(alpha.getValue(meta)).toBe("value");
	});

	it("supports empty value and name checks", () => {
		const alpha = createMetadata<"alpha", string>("alpha");
		const beta = createMetadata("beta");
		const meta = beta();

		expect(beta.dataName).toBe("beta");
		expect(beta.is(meta)).toBe(true);
		expect(alpha.is(meta)).toBe(false);
		expect(beta.getValue(meta)).toBeUndefined();
	});
});
