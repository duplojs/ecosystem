import { isType } from "./isType";
import type { AnyFunction, AnyValue, ComputedTypeError, IsEqual, MayBeGetter, UnwrapGetter } from "./types";

type RequireCallThenInput<
	GenericInput extends unknown,
> = IsEqual<GenericInput, any> extends true
	? unknown
	: Parameters<Extract<GenericInput, AnyFunction>> extends []
		? unknown
		: ComputedTypeError<"callThen getters must not declare parameters.">;

type CallThenResult<
	GenericInput extends unknown,
	GenericOutput extends unknown,
	GenericOutputCatch extends unknown,
> = GenericInput extends Promise<unknown>
	? Promise<Awaited<GenericOutput | GenericOutputCatch>>
	: GenericOutput | GenericOutputCatch;

type CallThenCatchResult<
	GenericInput extends unknown,
	GenericOutput extends unknown,
	GenericOutputCatch extends unknown,
> = GenericInput extends AnyFunction
	? GenericOutputCatch | CallThenResult<ReturnType<GenericInput>, GenericOutput, GenericOutputCatch>
	: CallThenResult<GenericInput, GenericOutput, GenericOutputCatch>;

export function callThen<
	GenericInput extends unknown,
	GenericOutput extends unknown,
>(
	input: GenericInput,
	theFunction: (
		result: Awaited<GenericInput>,
	) => GenericOutput,
	catchFunction?: undefined,
): CallThenResult<GenericInput, GenericOutput, never>;

export function callThen<
	GenericInput extends MayBeGetter<unknown>,
	GenericOutput extends unknown,
	GenericOutputCatch extends unknown,
>(
	input: GenericInput & NoInfer<RequireCallThenInput<GenericInput>>,
	theFunction: (result: Awaited<UnwrapGetter<GenericInput>>) => GenericOutput,
	catchFunction: (error: unknown) => GenericOutputCatch,
): CallThenCatchResult<GenericInput, GenericOutput, GenericOutputCatch>;

export function callThen(
	input: unknown,
	theFunction: AnyFunction,
	catchFunction?: (error: unknown) => unknown,
): any {
	if (catchFunction) {
		try {
			const value = input as AnyValue;
			const result = isType(value, "function") ? value() : value;
			if (result instanceof Promise) {
				return result
					.then(theFunction)
					.catch(catchFunction);
			}

			return theFunction(result);
		} catch (error) {
			return catchFunction(error);
		}
	}

	if (input instanceof Promise) {
		return input
			.then(theFunction);
	}

	return theFunction(input);
}
