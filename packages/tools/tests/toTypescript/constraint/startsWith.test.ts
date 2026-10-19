import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DataStructureToTypescript } from "@scripts";

describe("startsWithConstraintTransformer", () => {
	it.each([
		{
			name: "a literal",
			searchString: "asset:",
		},
		{
			name: "an empty literal",
			searchString: "",
		},
		{
			name: "an escaped literal",
			searchString: "` ${value} \\ \" é😀\n",
		},
	])("renders $name", ({ searchString }) => {
		const structure = DDataStructure.string([DDataStructure.startsWith(searchString)]);
		const result = DataStructureToTypescript.render(structure, {
			identifier: "ResourcePath",
			structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
			typeTransformers: DataStructureToTypescript.defaultTypeTransformers,
			constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
		});

		expect(result).toMatchSnapshot();
	});

	it("renders combined string constraints", () => {
		const structure = DDataStructure.string([
			DDataStructure.startsWith("asset:"),
			DDataStructure.endsWith(".json"),
			DDataStructure.include("/lang/"),
		]);
		const result = DataStructureToTypescript.render(structure, {
			identifier: "ResourcePath",
			structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
			typeTransformers: DataStructureToTypescript.defaultTypeTransformers,
			constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
		});

		expect(result).toMatchSnapshot();
	});
});
