import { type CheckerDefinition, createChecker, type Checker, type CheckerFunctionOutput, type CheckerFunctionParams } from "@core/checker";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";
import * as DCommon from "@duplojs/lang/common";

export interface CheckerBuilderParams {
	readonly options?: Record<string, unknown>;
}

export interface CheckerBuilder<
	GenericParams extends CheckerBuilderParams = CheckerBuilderParams,
> extends DCommon.Builder<CheckerBuilderParams> {
	handler<
		GenericInput extends unknown,
		GenericOutput extends CheckerFunctionOutput,
	>(
		theFunction: (
			input: GenericInput,
			params: CheckerFunctionParams<GenericParams["options"]>,
		) => DCommon.MaybePromise<GenericOutput>
	): Checker<
		{
			theFunction(
				input: GenericInput,
				params: CheckerFunctionParams<GenericParams["options"]>
			): DCommon.MaybePromise<GenericOutput>;
			options: GenericParams["options"];
		}
	>;
}

export const checkerBuilder = DCommon.createBuilder<CheckerBuilder>(
	createCoreLibStringIdentifier("checker"),
);

checkerBuilder.set(
	"handler",
	({
		args: [theFunction],
		accumulator,
	}) => createChecker({
		theFunction,
		options: accumulator.options,
	}),
);

export function useCheckerBuilder<
	GenericOptions extends CheckerDefinition["options"] = never,
>(
	params?: { options?: GenericOptions },
): CheckerBuilder<{
	readonly options: DCommon.NeverCoalescing<GenericOptions, undefined>;
}> {
	return checkerBuilder.use({
		options: undefined,
		...params,
	});
}
