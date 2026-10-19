import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DataStructureToDataStructure, DataStructureToTypescript } from "@scripts";

describe("endsWithConstraintTransformer", () => {
	it.each([
		{
			name: "a literal",
			searchString: ".json",
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
			path: DDataStructure.string([DDataStructure.endsWith(searchString)]),
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
});
