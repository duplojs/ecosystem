import { GroupResult, GroupOutputResult, GroupTheFunctionParams } from './group';
import type * as DCommon from '../common';
export declare function asyncGroup<GenericItem extends unknown, GenericOutput extends GroupOutputResult>(theFunction: (item: GenericItem, params: GroupTheFunctionParams) => DCommon.MaybePromise<GenericOutput>): (asyncIterator: AsyncIterable<GenericItem>) => Promise<GroupResult<GenericOutput>>;
export declare function asyncGroup<GenericItem extends unknown, GenericOutput extends GroupOutputResult>(asyncIterator: AsyncIterable<GenericItem>, theFunction: (item: GenericItem, params: GroupTheFunctionParams) => DCommon.MaybePromise<GenericOutput>): Promise<GroupResult<GenericOutput>>;
