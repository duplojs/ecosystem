export type GetItem<
	GenericGenerator extends (
		| Iterable<unknown>
		| AsyncIterable<unknown>
	),
> = GenericGenerator extends Iterable<infer InferredItem>
	? InferredItem
	: GenericGenerator extends AsyncIterable<infer InferredItem>
		? InferredItem
		: never;
