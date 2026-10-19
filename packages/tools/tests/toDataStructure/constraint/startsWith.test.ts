import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DataStructureToDataStructure, DataStructureToTypescript } from "@scripts";

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
	])("renders $name in a nested structure", ({ searchString }) => {
		const structure = DDataStructure.object({
			path: DDataStructure.string([DDataStructure.startsWith(searchString)]),
		});
		const result = DataStructureToDataStructure.render(structure, {
			identifier: "Resource",
			structureTransformers: DataStructureToDataStructure.defaultStructureTransformers,
			typeTransformers: DataStructureToDataStructure.defaultTypeTransformers,
			constraintTransformers: DataStructureToDataStructure.defaultConstraintTransformers,
			toTypescript: {
				structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
				typeTransformers: DataStructureToTypescript.defaultTypeTransformers,
				constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
			},
		});

		expect(result).toMatchSnapshot();
	});

	it("renders combined constraints on an identified structure", () => {
		const structure = DDataStructure.string([
			DDataStructure.startsWith("asset:"),
			DDataStructure.endsWith(".json"),
			DDataStructure.include("/lang/"),
		]).addIdentifier("ResourcePath");
		const result = DataStructureToDataStructure.render(structure, {
			identifier: "ResourcePath",
			structureTransformers: DataStructureToDataStructure.defaultStructureTransformers,
			typeTransformers: DataStructureToDataStructure.defaultTypeTransformers,
			constraintTransformers: DataStructureToDataStructure.defaultConstraintTransformers,
			toTypescript: {
				structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
				typeTransformers: DataStructureToTypescript.defaultTypeTransformers,
				constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
			},
		});

		expect(result).toMatchSnapshot();
	});
});
