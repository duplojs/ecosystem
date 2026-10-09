import { AnyTuple } from './types';
export declare function promiseAll<const GenericInput extends AnyTuple | Iterable<unknown>>(input: GenericInput): GenericInput extends AnyTuple ? Promise<{
    -readonly [Prop in keyof GenericInput]: Awaited<GenericInput[Prop]>;
}> : GenericInput extends Iterable<infer InferredValue> ? Promise<Awaited<InferredValue>[]> : never;
