import { cast } from '../cast';
export type ConstraintInput<GenericInput extends unknown, GenericExpectedValue extends unknown> = Parameters<typeof cast<GenericInput, GenericExpectedValue>>[0];
