import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";
import { includesUndefinedTypeNode } from "@scripts/toTypescript";

function createStringLiteralUnionTypeNode(
	values: readonly string[],
): Typescript.TypeNode {
	const typeNodes = values.map(
		(value) => Typescript.factory.createLiteralTypeNode(
			Typescript.factory.createStringLiteral(value),
		),
	);

	return typeNodes.length === 1
		? typeNodes[0]!
		: Typescript.factory.createUnionTypeNode(typeNodes);
}

function excludeUndefinedTypeNode(
	typeNode: Typescript.TypeNode,
): Typescript.TypeNode {
	if (typeNode.kind === Typescript.SyntaxKind.UndefinedKeyword) {
		return Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.NeverKeyword,
		);
	}

	if (!Typescript.isUnionTypeNode(typeNode)) {
		return typeNode;
	}

	const typeNodes = typeNode.types.filter(
		(subTypeNode) => subTypeNode.kind !== Typescript.SyntaxKind.UndefinedKeyword,
	);

	if (typeNodes.length === 0) {
		return Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.NeverKeyword,
		);
	}

	return typeNodes.length === 1
		? typeNodes[0]!
		: Typescript.factory.createUnionTypeNode(typeNodes);
}

function getStringLiteralTypeNodeValues(
	typeNode: Typescript.TypeNode,
): string[] | null {
	if (
		Typescript.isLiteralTypeNode(typeNode)
		&& Typescript.isStringLiteral(typeNode.literal)
	) {
		return [typeNode.literal.text];
	}

	if (!Typescript.isUnionTypeNode(typeNode)) {
		return null;
	}

	const values: string[] = [];

	for (const subTypeNode of typeNode.types) {
		if (
			!Typescript.isLiteralTypeNode(subTypeNode)
			|| !Typescript.isStringLiteral(subTypeNode.literal)
		) {
			return null;
		}

		values.push(subTypeNode.literal.text);
	}

	return values;
}

function sameStringSet(
	left: readonly string[],
	right: readonly string[],
): boolean {
	return left.length === right.length
		&& left.every((value) => right.includes(value));
}

function createReadonlyRecordTypeNode(
	keyTypeNode: Typescript.TypeNode,
	valueTypeNode: Typescript.TypeNode,
): Typescript.TypeReferenceNode {
	return Typescript.factory.createTypeReferenceNode(
		"Readonly",
		[
			Typescript.factory.createTypeReferenceNode(
				"Record",
				[
					keyTypeNode,
					valueTypeNode,
				],
			),
		],
	);
}

function createPartialTypeNode(
	typeNode: Typescript.TypeNode,
): Typescript.TypeReferenceNode {
	return Typescript.factory.createTypeReferenceNode(
		"Partial",
		[typeNode],
	);
}

export const recordStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.recordStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const keyResult = transformer(structure.definition.key);

		if (DEither.isLeft(keyResult)) {
			return keyResult;
		}

		const valueResult = transformer(structure.definition.value);

		if (DEither.isLeft(valueResult)) {
			return valueResult;
		}

		const valueTypeNode = DEither.unwrapRight(valueResult);
		const keyTypeNode = excludeUndefinedTypeNode(DEither.unwrapRight(keyResult));

		const recordTypeNode = createReadonlyRecordTypeNode(
			keyTypeNode,
			valueTypeNode,
		);

		const requiredKeys = structure.definition.requiredKeys.value;

		if (requiredKeys === null || includesUndefinedTypeNode(valueTypeNode)) {
			return success(createPartialTypeNode(recordTypeNode));
		}

		if (requiredKeys.length === 0) {
			return success(createPartialTypeNode(recordTypeNode));
		}

		const requiredKeysTypeNode = createStringLiteralUnionTypeNode(requiredKeys);
		const keyValues = getStringLiteralTypeNodeValues(keyTypeNode);

		if (keyValues && sameStringSet(keyValues, requiredKeys)) {
			return success(recordTypeNode);
		}

		return success(
			Typescript.factory.createIntersectionTypeNode([
				createReadonlyRecordTypeNode(
					requiredKeysTypeNode,
					valueTypeNode,
				),
				createPartialTypeNode(
					createReadonlyRecordTypeNode(
						Typescript.factory.createTypeReferenceNode(
							"Exclude",
							[
								keyTypeNode,
								requiredKeysTypeNode,
							],
						),
						valueTypeNode,
					),
				),
			]),
		);
	},
);
