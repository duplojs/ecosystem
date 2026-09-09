import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "./constraints";
import type { Join } from "./types";

type RemoveStringConstraints<
	GenericStrings extends readonly string[],
> = GenericStrings extends readonly []
	? []
	: GenericStrings extends readonly [
		infer InferredHead extends string,
		...infer InferredRest extends readonly string[],
	]
		? [
			DCommon.RemoveConstraint<InferredHead>,
			...RemoveStringConstraints<InferredRest>,
		]
		: string[];

type ConcatOutput<
	GenericString extends string,
	GenericElement extends string,
	GenericElementsRest extends readonly string[] = [],
> = ReapplyCompatiblesConstraints<
	GenericString,
	`${Extract<DCommon.RemoveConstraint<GenericString>, string>}${Extract<DCommon.RemoveConstraint<GenericElement>, string>}${Join<RemoveStringConstraints<GenericElementsRest>>}`,
	"minCharacters"
>;

export function concat<
	GenericString extends string,
	GenericElement extends string,
	GenericOutput = ConcatOutput<GenericString, GenericElement>,
>(
	element: GenericElement,
): (
	string: GenericString,
) => DCommon.BreakGenericLink<GenericOutput>;

export function concat<
	GenericString extends string,
	GenericElement extends string,
	GenericElementsRest extends readonly string[],
	GenericOutput = ConcatOutput<GenericString, GenericElement, GenericElementsRest>,
>(
	string: GenericString,
	element: GenericElement,
	...elementsRest: GenericElementsRest
): DCommon.BreakGenericLink<GenericOutput>;

export function concat(
	...args:
		| [element: string]
		| [string: string, element: string, ...elementsRest: string[]]
) {
	if (args.length === 1) {
		const [element] = args;

		return (string: string) => concat(string, element);
	}

	const [string, element, ...elementsRest] = args as [
		string,
		string,
		...string[],
	];

	return string.concat(element, ...elementsRest);
}
