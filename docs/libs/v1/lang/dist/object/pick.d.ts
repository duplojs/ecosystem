import { GetPropsWithValue } from './types';
import type * as DCommon from '../common';
type ComputeResultWithPickIsObject<GenericInput extends object, GenericPickValue extends Partial<Record<keyof GenericInput, boolean>>> = DCommon.SimplifyTopLevel<Pick<GenericInput, Extract<GetPropsWithValue<GenericPickValue, true>, keyof GenericInput>> & Partial<Pick<GenericInput, Extract<GetPropsWithValue<GenericPickValue, boolean> | GetPropsWithValue<GenericPickValue, boolean | undefined> | GetPropsWithValue<GenericPickValue, true | undefined>, keyof GenericInput>>>>;
type PickValue<GenericInput extends object> = Partial<Record<keyof GenericInput, boolean>> | readonly (keyof GenericInput)[];
type PickOutput<GenericInput extends object, GenericPickValue extends PickValue<GenericInput>> = GenericPickValue extends Partial<Record<keyof GenericInput, boolean>> ? ComputeResultWithPickIsObject<GenericInput, GenericPickValue> : DCommon.SimplifyTopLevel<Pick<GenericInput, Extract<GenericPickValue, readonly DCommon.ObjectKey[]>[number]>>;
export declare function pick<GenericInput extends object, const GenericPickValue extends PickValue<GenericInput>>(pickValue: GenericPickValue): (input: GenericInput) => PickOutput<GenericInput, GenericPickValue>;
export declare function pick<GenericInput extends object, const GenericPickValue extends PickValue<GenericInput>>(input: GenericInput, pickValue: GenericPickValue): PickOutput<GenericInput, GenericPickValue>;
export {};
