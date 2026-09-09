import * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import { type ComplexMatchedValue, type ComplexUnMatchedValue, type Pattern, type PatternValue } from "../types";
import { isMatch } from "../isMatch";
import { createKind } from "../kind";

export interface BuilderMatcher {
	isMatch(value: unknown): boolean;
	theFunction(value: unknown): unknown;
}

export interface MatchBuilderDefinition {
	input: unknown;
	matchers: BuilderMatcher[];
}

export interface MatchBuilder<
	GenericValue extends unknown = never,
	GenericResult extends unknown = never,
> extends DCommon.Builder<MatchBuilderDefinition> {
	with<
		const GenericPattern extends Pattern<GenericValue>,
		GenericOutput extends unknown,
	>(
		pattern: DCommon.FixDeepFunctionInfer<
			Pattern<GenericValue>,
			GenericPattern
		>,
		theFunction: (
			value: ComplexMatchedValue<
				GenericValue,
				PatternValue<GenericPattern>
			>,
		) => GenericOutput
	): MatchBuilder<
		ComplexUnMatchedValue<
			GenericValue,
			PatternValue<GenericPattern>
		>,
		GenericOutput | GenericResult
	>;

	when<
		GenericPredicatedInput extends GenericValue,
		GenericOutput extends unknown,
	>(
		predicate: (
			input: GenericValue,
		) => input is GenericPredicatedInput,
		theFunction: (predicatedInput: GenericPredicatedInput) => GenericOutput
	): MatchBuilder<
		Exclude<GenericValue, GenericPredicatedInput>,
		GenericOutput | GenericResult
	>;

	when<
		GenericOutput extends unknown,
	>(
		predicate: (
			input: GenericValue,
		) => boolean,
		theFunction: (predicatedInput: GenericValue) => GenericOutput
	): MatchBuilder<
		GenericValue,
		GenericOutput | GenericResult
	>;

	whenNot<
		GenericPredicatedInput extends GenericValue,
		GenericOutput extends unknown,
	>(
		predicate: (
			input: GenericValue,
		) => input is GenericPredicatedInput,
		theFunction: (predicatedInput: Exclude<GenericValue, GenericPredicatedInput>) => GenericOutput
	): MatchBuilder<
		Extract<GenericValue, GenericPredicatedInput>,
		GenericOutput | GenericResult
	>;

	whenNot<
		GenericOutput extends unknown,
	>(
		predicate: (
			input: GenericValue,
		) => boolean,
		theFunction: (predicatedInput: GenericValue) => GenericOutput
	): MatchBuilder<
		GenericValue,
		GenericOutput | GenericResult
	>;

	exhaustive: DCommon.IsEqual<GenericValue, never> extends true
		? () => GenericResult
		: (
			& DCommon.ComputedTypeError<"Pattern are not exhaustive.">
			& { restValue: GenericValue }
		);

	otherwise<GenericOtherwiseResult extends unknown>(
		theFunction: (value: GenericValue) => GenericOtherwiseResult
	): GenericResult | GenericOtherwiseResult;
}

export class InvalidExhaustivePatternError extends DKind.parentClass(
	createKind("invalid-exhaustive-pattern-error"),
	Error,
) {
	public constructor(
		public input: unknown,
	) {
		super("Invalid exhaustive pattern. If typing is correct, report your situation on github.");
	}
}

export const matchBuilder = DCommon.justExec(() => {
	const builder = DCommon.createBuilder<
		& MatchBuilder<unknown, unknown>
		& Pick<MatchBuilder<never, unknown>, "exhaustive">
	>("@duplojs/lang/pattern/match");

	builder.set(
		"with",
		({
			args: [pattern, theFunction],
			accumulator,
			next,
		}) => next({
			...accumulator,
			matchers: [
				...accumulator.matchers,
				{
					isMatch: isMatch(pattern),
					theFunction,
				},
			],
		}),
	);

	builder.set(
		"when",
		({
			args: [predicate, theFunction],
			accumulator,
			next,
		}) => next({
			...accumulator,
			matchers: [
				...accumulator.matchers,
				{
					isMatch: predicate,
					theFunction,
				},
			],
		}),
	);

	builder.set(
		"whenNot",
		({
			args: [predicate, theFunction],
			accumulator,
			next,
		}) => next({
			...accumulator,
			matchers: [
				...accumulator.matchers,
				{
					isMatch: (value) => !predicate(value),
					theFunction,
				},
			],
		}),
	);

	builder.set(
		"exhaustive",
		({
			accumulator: {
				input,
				matchers,
			},
		}) => {
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
			for (let index = 0; index < matchers.length; index++) {
				if (matchers[index]!.isMatch(input)) {
					return matchers[index]!.theFunction(input);
				}
			}

			throw new InvalidExhaustivePatternError(input);
		},
	);

	builder.set(
		"otherwise",
		({
			args: [theFunction],
			accumulator: {
				input,
				matchers,
			},
		}) => {
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
			for (let index = 0; index < matchers.length; index++) {
				if (matchers[index]!.isMatch(input)) {
					return matchers[index]!.theFunction(input);
				}
			}

			return theFunction(input);
		},
	);

	return builder;
});
