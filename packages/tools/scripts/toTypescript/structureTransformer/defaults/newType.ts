import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

function createConstraintsTypeNode(
	constraintTypeNodes: readonly Typescript.TypeNode[],
): Typescript.TypeNode {
	if (constraintTypeNodes.length === 0) {
		return Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.NeverKeyword);
	}

	if (constraintTypeNodes.length === 1) {
		return constraintTypeNodes[0]!;
	}

	return Typescript.factory.createUnionTypeNode(constraintTypeNodes);
}

export const newTypeStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DModeling.newTypeStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
			transformConstraint,
			addImport,
		},
	) => {
		const innerResult = transformer(structure.definition.inner);

		if (DEither.isLeft(innerResult)) {
			return innerResult;
		}

		const innerTypeNode = DEither.unwrapRight(innerResult);
		const constraintTypeNodes: Typescript.TypeNode[] = [];

		for (const constraint of structure.definition.newTypeConstraints) {
			const constraintResult = transformConstraint(constraint);

			if (DEither.isLeft(constraintResult)) {
				return constraintResult;
			}

			constraintTypeNodes.push(DEither.unwrapRight(constraintResult));
		}

		addImport("@duplojs/lang/modeling", "DModeling", "namespace");

		return success(
			Typescript.factory.createIntersectionTypeNode([
				...(Typescript.isIntersectionTypeNode(innerTypeNode)
					? innerTypeNode.types
					: [innerTypeNode]),
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createQualifiedName(
						Typescript.factory.createIdentifier("DModeling"),
						Typescript.factory.createIdentifier("NewType"),
					),
					[
						Typescript.factory.createLiteralTypeNode(
							Typescript.factory.createStringLiteral(structure.name),
						),
						createConstraintsTypeNode(constraintTypeNodes),
					],
				),
			]),
		);
	},
);
