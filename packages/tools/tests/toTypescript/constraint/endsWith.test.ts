import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DataStructureToTypescript } from "@scripts";

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
	])("renders $name", ({ searchString }) => {
		const structure = DDataStructure.string([DDataStructure.endsWith(searchString)]);
		const result = DataStructureToTypescript.render(structure, {
			identifier: "ResourcePath",
			structureTransformers: DataStructureToTypescript.defaultStructureTransformers,
			typeTransformers: DataStructureToTypescript.defaultTypeTransformers,
			constraintTransformers: DataStructureToTypescript.defaultConstraintTransformers,
		});

		expect(result).toMatchSnapshot();
	});
});
