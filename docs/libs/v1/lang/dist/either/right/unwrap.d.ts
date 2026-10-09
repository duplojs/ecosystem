import { Right } from './create';
import { GetValue } from '../types';
export declare function unwrapRight<GenericInput extends unknown>(input: GenericInput): GenericInput extends Right ? GetValue<GenericInput> : GenericInput;
