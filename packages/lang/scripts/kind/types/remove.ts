import { type Kind, type KeySymbol } from "../base";

export type Remove<
	GenericObject extends object,
> = GenericObject extends Kind<any>
	? Omit<GenericObject, KeySymbol>
	: GenericObject;
