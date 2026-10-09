import { GetPropsWithValue, PartialKeys } from './types';
import type * as DCommon from '../common';
type ComputeResultWithOmitIsObject<GenericInput extends object, GenericOmitValue extends Partial<Record<keyof GenericInput, boolean>>> = DCommon.SimplifyTopLevel<Omit<GenericInput, GetPropsWithValue<GenericOmitValue, true>> extends infer InferredValue extends object ? PartialKeys<InferredValue, Extract<GetPropsWithValue<GenericOmitValue, boolean> | GetPropsWithValue<GenericOmitValue, boolean | undefined> | GetPropsWithValue<GenericOmitValue, true | undefined>, keyof InferredValue>> : never>;
type OmitValue<GenericInput extends object> = Partial<Record<keyof GenericInput, boolean>> | readonly (keyof GenericInput)[];
type OmitOutput<GenericInput extends object, GenericOmitValue extends OmitValue<GenericInput>> = GenericOmitValue extends Partial<Record<keyof GenericInput, boolean>> ? ComputeResultWithOmitIsObject<GenericInput, GenericOmitValue> : DCommon.SimplifyTopLevel<Omit<GenericInput, Extract<GenericOmitValue, readonly DCommon.ObjectKey[]>[number]>>;
export declare function omit<GenericInput extends object, const GenericOmitValue extends OmitValue<GenericInput>>(omitValue: GenericOmitValue): (input: GenericInput) => OmitOutput<GenericInput, GenericOmitValue>;
export declare function omit<GenericInput extends object, const GenericOmitValue extends OmitValue<GenericInput>>(input: GenericInput, omitValue: GenericOmitValue): OmitOutput<GenericInput, GenericOmitValue>;
export {};
