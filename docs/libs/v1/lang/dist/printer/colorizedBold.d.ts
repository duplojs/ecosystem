import { Colors } from './types';
export declare function colorizedBold<GenericInput extends string>(color: Colors): (input: GenericInput) => string;
export declare function colorizedBold<GenericInput extends string>(input: GenericInput, color: Colors): string;
