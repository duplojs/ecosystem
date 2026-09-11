import { DStoTS } from "@scripts";

describe("addImportToContext", () => {
	it("adds an import of the requested kind", () => {
		const importContext: DStoTS.MapImportContext = new Map();

		DStoTS.addImportToContext(importContext, "@acme/customers", "CustomerRecord", "namespace");

		expect(Array.from(importContext)).toStrictEqual(
			[
				[
					"@acme/customers",
					{
						namespace: ["CustomerRecord"],
					},
				],
			],
		);
	});

	it("preserves existing imports and ignores duplicate names", () => {
		const importContext: DStoTS.MapImportContext = new Map([
			[
				"@acme/customers",
				{
					default: ["CustomerFactory"],
					direct: ["CustomerRecord"],
				},
			],
		]);

		DStoTS.addImportToContext(importContext, "@acme/customers", "CustomerRecord", "direct");
		DStoTS.addImportToContext(importContext, "@acme/customers", "CustomerSummary", "direct");

		expect(Array.from(importContext)).toStrictEqual(
			[
				[
					"@acme/customers",
					{
						default: ["CustomerFactory"],
						direct: ["CustomerRecord", "CustomerSummary"],
					},
				],
			],
		);
	});
});

describe("createAddImport", () => {
	it("adds a direct import when kind is omitted", () => {
		const importContext: DStoTS.MapImportContext = new Map();
		const addImport = DStoTS.createAddImport(importContext);

		addImport("@acme/customers", "CustomerRecord");

		expect(Array.from(importContext)).toStrictEqual(
			[
				[
					"@acme/customers",
					{
						direct: ["CustomerRecord"],
					},
				],
			],
		);
	});
});
