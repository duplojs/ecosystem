import * as DCommon from "@duplojs/lang/common";
import { createKind } from "./kind";
import type * as DKind from "@duplojs/lang/kind";

export const checkerOutputKind = createKind("checker-output");

export interface CheckerFunctionOutput<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof checkerOutputKind> {
	information: GenericInformation;
	value: GenericValue;
}

export interface CheckerFunctionParams<
	GenericOptions extends Record<string, unknown> | undefined = Record<string, unknown> | undefined,
> {
	options: GenericOptions;
	output<
		GenericInformation extends string,
		GenericValue extends unknown,
	>(
		information: GenericInformation,
		value: GenericValue,
	): CheckerFunctionOutput<
		GenericInformation,
		GenericValue
	>;
}

export interface CheckerDefinition {
	theFunction(
		input: unknown,
		params: CheckerFunctionParams
	): DCommon.MaybePromise<CheckerFunctionOutput>;
	readonly options?: Record<string, unknown>;
}

export const checkerKind = createKind("checker");

export interface Checker<
	GenericDefinition extends CheckerDefinition = CheckerDefinition,
> extends DKind.Kind<typeof checkerKind> {
	readonly definition: GenericDefinition;
}

export function createChecker<
	GenericDefinition extends CheckerDefinition,
>(
	definition: GenericDefinition,
): Checker<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => checkerKind.setTo(value, null),
	);
}

export type GetCheckerInput<
	GenericChecker extends Checker,
> = Parameters<GenericChecker["definition"]["theFunction"]>[0];

export type GetCheckerResult<
	GenericChecker extends Checker,
> = ReturnType<GenericChecker["definition"]["theFunction"]>;

export type GetCheckerOptions<
	GenericChecker extends Checker,
> = GenericChecker["definition"]["options"];
