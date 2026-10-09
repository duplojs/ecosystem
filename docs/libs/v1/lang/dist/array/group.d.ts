import type * as DCommon from '../common';
export interface GroupOutputResult<GenericGroupName extends string = string, GenericGroupValue extends unknown = unknown> {
    group: GenericGroupName;
    value: GenericGroupValue;
}
export declare function groupOutput<GenericGroupValue extends unknown, GenericGroupName extends string>(group: GenericGroupName): (value: GenericGroupValue) => GroupOutputResult<GenericGroupName, GenericGroupValue>;
export declare function groupOutput<GenericGroupValue extends unknown, GenericGroupName extends string>(group: GenericGroupName, value: GenericGroupValue): GroupOutputResult<GenericGroupName, GenericGroupValue>;
export interface GroupTheFunctionParams {
    index: number;
    output: typeof groupOutput;
}
export type GroupResult<GenericOutput extends GroupOutputResult> = DCommon.SimplifyTopLevel<{
    readonly [Output in GenericOutput as Output["group"]]?: readonly [Output["value"], ...Output["value"][]];
}>;
export declare function group<GenericArray extends readonly unknown[], GenericOutput extends GroupOutputResult>(theFunction: (element: GenericArray[number], params: GroupTheFunctionParams) => GenericOutput): (array: GenericArray) => GroupResult<GenericOutput>;
export declare function group<GenericElement extends unknown, GenericOutput extends GroupOutputResult>(array: readonly GenericElement[], theFunction: (element: GenericElement, params: GroupTheFunctionParams) => GenericOutput): GroupResult<GenericOutput>;
