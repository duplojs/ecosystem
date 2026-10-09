import { Constraint } from './constraint';
import * as DChrono from '../chrono';
export type EligibleFormDataValue = (boolean | number | null | string | File | undefined | DChrono.TheDate | DChrono.TheTime | Constraint | {
    [key: string]: EligibleFormDataValue;
} | EligibleFormDataValue[]);
export declare class TheFormData<GenericValues extends Record<string, EligibleFormDataValue>> extends FormData {
    readonly inputValues: GenericValues;
    private constructor();
    static toFlatEntries(input: EligibleFormDataValue, path?: string): Iterable<[string, string | File], void>;
    static fromEntries(iterable: Iterable<[string, unknown]>, arrayMaxIndex: number): object;
}
export declare function createFormData<GenericValues extends Record<string, EligibleFormDataValue>>(inputValues: GenericValues): TheFormData<GenericValues>;
