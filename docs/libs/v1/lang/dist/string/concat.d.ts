import { ReapplyCompatiblesConstraints } from './constraints';
import { Join } from './types';
import type * as DCommon from '../common';
type RemoveStringConstraints<GenericStrings extends readonly string[]> = GenericStrings extends readonly [] ? [] : GenericStrings extends readonly [
    infer InferredHead extends string,
    ...infer InferredRest extends readonly string[]
] ? [
    DCommon.RemoveConstraint<InferredHead>,
    ...RemoveStringConstraints<InferredRest>
] : string[];
type ConcatOutput<GenericString extends string, GenericElement extends string, GenericElementsRest extends readonly string[] = []> = ReapplyCompatiblesConstraints<GenericString, `${Extract<DCommon.RemoveConstraint<GenericString>, string>}${Extract<DCommon.RemoveConstraint<GenericElement>, string>}${Join<RemoveStringConstraints<GenericElementsRest>>}`, "minCharacters">;
export declare function concat<GenericString extends string, GenericElement extends string>(element: GenericElement): (string: GenericString) => DCommon.BreakGenericLink<ConcatOutput<GenericString, GenericElement>>;
export declare function concat<GenericString extends string, GenericElement extends string, GenericElementsRest extends readonly string[]>(string: GenericString, element: GenericElement, ...elementsRest: GenericElementsRest): DCommon.BreakGenericLink<ConcatOutput<GenericString, GenericElement, GenericElementsRest>>;
export {};
