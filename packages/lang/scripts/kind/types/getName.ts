import { type Definition, type Handler, type Kind } from "../base";

export type GetName<
	GenericValue extends Kind<Handler>,
> = GenericValue extends Kind<Handler<Definition<infer InferredKindName>>>
	? InferredKindName
	: never;
