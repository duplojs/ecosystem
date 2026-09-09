import type { Handler, KeySymbol, Kind } from "../base";

export type GetValue<
	GenericKindHandler extends Handler,
	GenericObject extends Kind<any>,
> = GenericObject[KeySymbol][GenericKindHandler["definition"]["name"]];
