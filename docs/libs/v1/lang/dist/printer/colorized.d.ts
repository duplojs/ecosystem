import { Colors } from './types';
export declare function colorized<GenericInput extends string>(color: Colors): (input: GenericInput) => string;
export declare function colorized<GenericInput extends string>(input: GenericInput, color: Colors): string;
