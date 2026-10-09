import { RefineConstraint } from '../constraint';
export declare function refine<GenericInput extends unknown, GenericPredicate extends GenericInput = GenericInput>(refine: (((data: GenericInput) => data is GenericPredicate) | ((data: GenericInput) => boolean))): RefineConstraint<GenericInput, GenericPredicate>;
