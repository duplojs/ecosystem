import type * as DCommon from "@scripts/common";

type ShapeObject<
	GenericInput extends unknown = unknown,
> = {
	[Prop in string]?: (input: GenericInput) => unknown
};

type RuntimeShapeObject = Partial<Record<string, (input: never) => unknown>>;

type ToOutput<
	GenericShapeObject extends ShapeObject<any>,
> = DCommon.SimplifyTopLevel<
	{
		[Prop in keyof GenericShapeObject]: (
			| ReturnType<
				Extract<
					GenericShapeObject[Prop],
					DCommon.AnyFunction
				>
			>
			| (
				undefined extends GenericShapeObject[Prop]
					? undefined
					: never
			)
		)
	}
>;

export function to<
	GenericInput extends unknown,
	GenericShapeObject extends ShapeObject<NoInfer<GenericInput>>,
>(
	shapeObject: ShapeObject<NoInfer<GenericInput>> & GenericShapeObject,
): (
	input: GenericInput,
) => ToOutput<NoInfer<GenericShapeObject>>;

export function to<
	GenericInput extends unknown,
	GenericShapeObject extends ShapeObject<GenericInput>,
>(
	input: GenericInput,
	shapeObject: DCommon.FixDeepFunctionInfer<
		ShapeObject<GenericInput>,
		GenericShapeObject
	>,
): ToOutput<GenericShapeObject>;

export function to(
	...args:
		| [shapeObject: RuntimeShapeObject]
		| [input: unknown, shapeObject: RuntimeShapeObject]
): any {
	if (args.length === 1) {
		const [shape] = args;

		return (input: unknown) => to(input, shape as never);
	}

	const [input, shapeObject] = args;

	return Object.entries(shapeObject)
		.reduce<Record<string, unknown>>(
			(acc, [key, theFunction]) => {
				acc[key] = theFunction?.(input as never);

				return acc;
			},
			{},
		);
}
