import { Definition, Handler } from '../base';
import { createNamespace } from '../namespace';
export type GetNamespaceName<GenericKindConstructor extends ReturnType<typeof createNamespace>> = ReturnType<GenericKindConstructor> extends Handler<Definition<`@${infer InferredName}/${string}`>> ? InferredName : never;
