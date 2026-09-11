import { DStoDS } from "@scripts";

describe("createImportContext", () => {
	it("creates a data structure import context with the default namespace import", () => {
		const importContext = DStoDS.createImportContext();

		expect(Array.from(importContext)).toStrictEqual(
			[
				[
					"@duplojs/lang/dataStructure",
					{
						namespace: ["DDataStructure"],
					},
				],
			],
		);
	});
});
