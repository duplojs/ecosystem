import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type { Typescript } from "@scripts/typescript";

export type ContextDeclaration =
	| Typescript.InterfaceDeclaration
	| Typescript.TypeAliasDeclaration;

export type MapContext = Map<
	DDataStructure.Structure,
	ContextDeclaration
>;
