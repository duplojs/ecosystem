import { type Kind, type KeySymbol, type Handler } from "../base";

export type RemoveOne<
	GenericKindHandler extends Handler,
	GenericObject extends object,
> = GenericObject extends Kind<GenericKindHandler>
	? (
		& Omit<GenericObject, KeySymbol>
		& {
			[__ in KeySymbol]: Omit<
				GenericObject[KeySymbol],
				GenericKindHandler["definition"]["name"]
			>
		}
	)
	: GenericObject;
