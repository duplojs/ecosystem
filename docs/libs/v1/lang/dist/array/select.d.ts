import type * as DCommon from '../common';
export interface SelectValueSelect<GenericOutput extends unknown = unknown> {
    "-select": GenericOutput;
}
export interface SelectValueSkip {
    "-skip": null;
}
export interface SelectTheFunctionParams<GenericArray extends readonly unknown[]> {
    element: GenericArray[number];
    index: number;
    self: GenericArray;
    skip(): SelectValueSkip;
    select<GenericOutput extends DCommon.AnyValue = DCommon.AnyValue>(output: GenericOutput): SelectValueSelect<GenericOutput>;
}
export declare const selectTools: Pick<SelectTheFunctionParams<any>, "skip" | "select">;
export declare function select<GenericArray extends readonly unknown[], GenericSelectValue extends SelectValueSelect>(theFunction: (params: SelectTheFunctionParams<GenericArray>) => GenericSelectValue | SelectValueSkip): (array: GenericArray) => GenericSelectValue["-select"][];
export declare function select<GenericArray extends readonly unknown[], GenericSelectValue extends SelectValueSelect>(array: GenericArray, theFunction: (params: SelectTheFunctionParams<GenericArray>) => GenericSelectValue | SelectValueSkip): GenericSelectValue["-select"][];
