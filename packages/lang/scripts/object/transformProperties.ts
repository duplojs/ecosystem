import type * as DCommon from "@scripts/common";

type TransformObject<
	GenericObjectInput extends object = object,
> = {
	[Prop in keyof GenericObjectInput]?: (input: GenericObjectInput[Prop]) => unknown
};

type RuntimeTransformObject = Partial<Record<string, (input: never) => unknown>>;

type TransformPropertiesOutput<
	GenericObjectInput extends object,
	GenericTransformObject extends TransformObject<GenericObjectInput>,
> = DCommon.SimplifyTopLevel<
	& Omit<GenericObjectInput, keyof GenericTransformObject>
	& {
		[Prop in keyof GenericTransformObject]: (
			| ReturnType<
				Extract<
					GenericTransformObject[Prop],
					DCommon.AnyFunction
				>
			>
		| (
			undefined extends GenericTransformObject[Prop]
				? GenericObjectInput[Extract<Prop, keyof GenericObjectInput>]
				: never

		)
		)
	}
>;

export function transformProperties<
	GenericObjectInput extends object,
	GenericTransformObject extends TransformObject<NoInfer<GenericObjectInput>>,
>(
	transformObject: TransformObject<NoInfer<GenericObjectInput>> & GenericTransformObject,
): (
	object: GenericObjectInput,
) => TransformPropertiesOutput<NoInfer<GenericObjectInput>, NoInfer<GenericTransformObject>>;

export function transformProperties<
	GenericObjectInput extends object,
	GenericTransformObject extends TransformObject<GenericObjectInput>,
>(
	object: GenericObjectInput,
	transformObject: DCommon.FixDeepFunctionInfer<
		TransformObject<GenericObjectInput>,
		GenericTransformObject
	>,
): TransformPropertiesOutput<GenericObjectInput, GenericTransformObject>;

export function transformProperties(
	...args:
		| [transformObject: RuntimeTransformObject]
		| [object: object, transformObject: RuntimeTransformObject]
): any {
	if (args.length === 1) {
		const [transformers] = args;

		return (obj: object) => transformProperties(obj, transformers);
	}

	const [obj, transformObject] = args;

	return Object.entries(transformObject)
		.reduce(
			(acc, [key, theFunction]) => {
				if (theFunction) {
					acc[key] = theFunction(acc[key] as never);
				}

				return acc;
			},
			{ ...obj } as Record<string, unknown>,
		);
}
