import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DataStructureToTypescript } from "@scripts";

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
	])("renders $name", ({ searchString }) => {
		const structure = DDataStructure.string([DDataStructure.include(searchString)]);
		const result = DataStructureToTypescript.render(structure, {
			identifier: "ResourcePath",
			structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
			typeTransformers: DataStructureToTypescript.defaultTypeTransformers,
			constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
		});

		expect(result).toMatchSnapshot();
	});
});
