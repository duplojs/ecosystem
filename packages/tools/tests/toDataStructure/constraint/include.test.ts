import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DataStructureToDataStructure, DataStructureToTypescript } from "@scripts";

describe("includeConstraintTransformer", () => {
	it.each([
		{
			name: "a literal",
			searchString: "/lang/",
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
			path: DDataStructure.string([DDataStructure.include(searchString)]),
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
