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
type PrependOutput<GenericString extends string, GenericElement extends string, GenericElementsRest extends readonly string[] = []> = ReapplyCompatiblesConstraints<GenericString, `${Extract<DCommon.RemoveConstraint<GenericElement>, string>}${Join<RemoveStringConstraints<GenericElementsRest>>}${Extract<DCommon.RemoveConstraint<GenericString>, string>}`, "minCharacters">;
export declare function prepend<GenericString extends string, GenericElement extends string>(element: GenericElement): (string: GenericString) => PrependOutput<GenericString, GenericElement>;
export declare function prepend<GenericString extends string, GenericElement extends string, GenericElementsRest extends readonly string[]>(string: GenericString, element: GenericElement, ...elementsRest: GenericElementsRest): PrependOutput<GenericString, GenericElement, GenericElementsRest>;
export {};
