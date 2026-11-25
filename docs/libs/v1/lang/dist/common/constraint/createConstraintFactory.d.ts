import { ConstraintInput, RemoveConstraint } from './types';
export declare function createConstraintFactory<GenericExpectedValue extends unknown>(): <const GenericInput extends RemoveConstraint<GenericExpectedValue>>(input: ConstraintInput<GenericInput, GenericExpectedValue>) => GenericInput & GenericExpectedValue;
