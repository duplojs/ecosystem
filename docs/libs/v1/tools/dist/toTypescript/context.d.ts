import { Typescript } from '../typescript';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type ContextDeclaration = Typescript.InterfaceDeclaration | Typescript.TypeAliasDeclaration;
export type MapContext = Map<DDataStructure.Structure, ContextDeclaration>;
