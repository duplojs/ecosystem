import { DataStructureToTypescript, Typescript } from "@duplojs/tools";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const fileTransformer = DataStructureToTypescript.createTypeTransformer(
	DSDataStructure.fileTypeKind.has,
	(__, { success }) => success(
		Typescript.factory.createTypeReferenceNode("File"),
	),
);

export const dateTransformer = DataStructureToTypescript.createTypeTransformer(
	DDataStructure.dateTypeKind.has,
	(__, { success, addImport }) => {
		addImport("@duplojs/lang/chrono", "TheDate");
		addImport("@duplojs/lang/chrono", "SerializedTheDate");

		return success(
			Typescript.factory.createUnionTypeNode([
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createIdentifier("SerializedTheDate"),
				),
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createIdentifier("TheDate"),
				),
			]),
		);
	},
);

export const timeTransformer = DataStructureToTypescript.createTypeTransformer(
	DDataStructure.timeTypeKind.has,
	(__, { success, addImport }) => {
		addImport("@duplojs/lang/chrono", "TheTime");
		addImport("@duplojs/lang/chrono", "SerializedTheTime");

		return success(
			Typescript.factory.createUnionTypeNode([
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createIdentifier("SerializedTheTime"),
				),
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createIdentifier("TheTime"),
				),
			]),
		);
	},
);

export const typescriptTypeTransformers = [
	fileTransformer,
	dateTransformer,
	timeTransformer,
	...DataStructureToTypescript.defaultTypeTransformers,
];
