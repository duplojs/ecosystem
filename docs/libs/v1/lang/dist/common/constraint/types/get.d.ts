import { BaseConstraint } from './base';
import { RemoveConstraint } from './remove';
export type GetConstraint<GenericValue extends unknown> = GenericValue extends ((infer InferredValue extends BaseConstraint) & RemoveConstraint<GenericValue>) ? InferredValue : never;
