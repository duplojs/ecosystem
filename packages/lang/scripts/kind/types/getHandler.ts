import { type Definition, type Handler, type KeySymbol, type Kind } from "../base";

export type GetHandler<
	GenericObject extends Kind<any>,
> = {
	[Prop in keyof GenericObject[KeySymbol]]: Prop extends string
		? Handler<
			Definition<
				Prop,
				GenericObject[KeySymbol][Prop]
			>
		>
		: never
}[keyof GenericObject[KeySymbol]];
