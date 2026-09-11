import * as DArray from "@duplojs/lang/array";
import { Typescript } from "@scripts/typescript";
import type { ContextDeclaration } from "./context";

export function includesUndefinedTypeNode(typeNode: Typescript.TypeNode): boolean {
	if (typeNode.kind === Typescript.SyntaxKind.UndefinedKeyword) {
		return true;
	}

	if (Typescript.isUnionTypeNode(typeNode)) {
		return DArray.some(
			typeNode.types,
			(subTypeNode) => includesUndefinedTypeNode(subTypeNode),
		);
	}

	return false;
}

export function contextDeclarationIncludesUndefined(
	declaration: ContextDeclaration,
) {
	if (Typescript.isTypeAliasDeclaration(declaration)) {
		return includesUndefinedTypeNode(declaration.type);
	}

	if (Typescript.isInterfaceDeclaration(declaration)) {
		return declaration.members.some((member) => {
			if (!Typescript.isPropertySignature(member)) {
				return false;
			}

			return member.type
				? includesUndefinedTypeNode(member.type)
				: false;
		});
	}

	return false;
}
