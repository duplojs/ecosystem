import { DataStructureToTypescript, Typescript } from "@duplojs/tools";
import * as DSDataStructure from "@duplojs/server/dataStructure";

export const fileTransformer = DataStructureToTypescript.createTypeTransformer(
	DSDataStructure.fileTypeKind.has,
	(__, { success }) => success(
		Typescript.factory.createTypeReferenceNode("File"),
	),
);

export const typescriptTypeTransformers = [
	fileTransformer,
	...DataStructureToTypescript.defaultTypeTransformers,
];
