import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";
import { contextDeclarationIncludesUndefined, includesUndefinedTypeNode } from "@scripts/toTypescript/includesUndefinedTypeNode";

const identifierRegex = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export const objectStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.objectStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
			context,
		},
	) => {
		const typeElements: Typescript.TypeElement[] = [];

		for (const entry of structure.definition.shape.value) {
			const valueResult = transformer(entry.value);

			if (DEither.isLeft(valueResult)) {
				return valueResult;
			}

			const propertyName = identifierRegex.test(entry.key)
				? Typescript.factory.createIdentifier(entry.key)
				: Typescript.factory.createStringLiteral(entry.key);

			const valueTypeNode = DEither.unwrapRight(valueResult);

			const contextDeclaration = context.get(entry.value);

			const includeUndefined = Typescript.isTypeReferenceNode(valueTypeNode) && contextDeclaration
				? contextDeclarationIncludesUndefined(contextDeclaration)
				: includesUndefinedTypeNode(valueTypeNode);

			typeElements.push(
				Typescript.factory.createPropertySignature(
					[Typescript.factory.createModifier(Typescript.SyntaxKind.ReadonlyKeyword)],
					propertyName,
					includeUndefined
						? Typescript.factory.createToken(Typescript.SyntaxKind.QuestionToken)
						: undefined,
					valueTypeNode,
				),
			);
		}

		return success(
			Typescript.factory.createTypeLiteralNode(typeElements),
		);
	},
);
