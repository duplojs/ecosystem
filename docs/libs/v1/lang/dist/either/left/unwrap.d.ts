import { Left } from './create';
import { GetValue } from '../types';
export declare function unwrapLeft<GenericInput extends unknown>(input: GenericInput): GenericInput extends Left ? GetValue<GenericInput> : GenericInput;
