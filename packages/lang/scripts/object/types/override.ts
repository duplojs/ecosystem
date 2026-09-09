import type * as DCommon from "@scripts/common";

export type Override<
	GenericInput extends object,
	GenericNewValue extends Partial<GenericInput>,
> = DCommon.SimplifyTopLevel<
	{
		[Prop in keyof GenericInput]: Prop extends keyof GenericNewValue
			? GenericNewValue[Prop] extends infer InferredNewValue
				? InferredNewValue extends undefined
					? GenericInput[Prop]
					: InferredNewValue
				: never
			: GenericInput[Prop]
	}
>;
