import { type Definition, type Handler } from "../base";
import { type createNamespace } from "../namespace";

export type GetNamespaceName<
	GenericKindConstructor extends ReturnType<typeof createNamespace>,
> = ReturnType<GenericKindConstructor> extends Handler<Definition<`@${infer InferredName}/${string}`>>
	? InferredName
	: never;
