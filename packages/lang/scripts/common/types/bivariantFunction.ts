import type { AnyFunction } from "./anyFunction";

/**
 * @remarks Allows you to bypass the `strictFunctionTypes` rule.
 * @link https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant
 * @link https://www.typescriptlang.org/tsconfig/#strictFunctionTypes
 */
export type BivariantFunction<
	GenericFunction extends AnyFunction,
> = {
	bivariantFunction(...args: Parameters<GenericFunction>): ReturnType<GenericFunction>;
}["bivariantFunction"];
