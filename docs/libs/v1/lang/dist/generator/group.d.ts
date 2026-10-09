import type * as DCommon from '../common';
export interface GroupOutputResult<GenericGroupName extends string = string, GenericGroupValue extends unknown = unknown> {
    group: GenericGroupName;
    value: GenericGroupValue;
}
export declare function groupOutput<const GenericGroupName extends string, GenericGroupValue extends unknown>(group: GenericGroupName): (value: GenericGroupValue) => GroupOutputResult<GenericGroupName, GenericGroupValue>;
export declare function groupOutput<const GenericGroupName extends string, GenericGroupValue extends unknown>(group: GenericGroupName, value: GenericGroupValue): GroupOutputResult<GenericGroupName, GenericGroupValue>;
export interface GroupTheFunctionParams {
    index: number;
    output: typeof groupOutput;
}
export type GroupResult<GenericOutput extends GroupOutputResult> = DCommon.SimplifyTopLevel<{
    readonly [Output in GenericOutput as Output["group"]]?: readonly [Output["value"], ...Output["value"][]];
}>;
export declare function group<GenericItem extends unknown, GenericOutput extends GroupOutputResult>(theFunction: (item: GenericItem, params: GroupTheFunctionParams) => GenericOutput): (iterator: Iterable<GenericItem>) => GroupResult<GenericOutput>;
export declare function group<GenericItem extends unknown, GenericOutput extends GroupOutputResult>(iterator: Iterable<GenericItem>, theFunction: (item: GenericItem, params: GroupTheFunctionParams) => GenericOutput): GroupResult<GenericOutput>;
