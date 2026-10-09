import { Kind, Handler } from './base';
import { GetHandler } from './types';
import type * as DCommon from '../common';
type KindIdentifierHandlers<GenericParent extends Kind<Handler>, GenericChildren extends GenericParent> = GenericChildren extends infer InferredChildren ? InferredChildren extends GenericParent ? GetHandler<InferredChildren> : never : never;
type KindIdentifierResult<GenericParent extends Kind<Handler>, GenericChildren extends GenericParent, GenericInput extends unknown, GenericGroupedKind extends unknown> = ((GenericInput extends GenericParent ? GenericChildren extends GenericInput ? GenericChildren extends GenericGroupedKind ? GenericChildren : never : never : never) | Extract<GenericInput, GenericGroupedKind>);
export interface KindIdentifier<GenericParent extends Kind<Handler>, GenericChildren extends GenericParent> {
    <GenericKindHandler extends KindIdentifierHandlers<GenericParent, GenericChildren>, GenericInput extends unknown, GenericGroupedKind extends DCommon.Forward<GenericKindHandler extends Handler ? Kind<GenericKindHandler> : never>>(kind: GenericKindHandler | GenericKindHandler[]): (input: GenericInput) => input is KindIdentifierResult<GenericParent, GenericChildren, GenericInput, GenericGroupedKind>;
    <GenericKindHandler extends KindIdentifierHandlers<GenericParent, GenericChildren>, GenericInput extends unknown, GenericGroupedKind extends DCommon.Forward<GenericKindHandler extends Handler ? Kind<GenericKindHandler> : never>>(input: GenericInput, kind: GenericKindHandler | GenericKindHandler[]): input is KindIdentifierResult<GenericParent, GenericChildren, GenericInput, GenericGroupedKind>;
}
export declare function createKindIdentifier<GenericParent extends Kind<Handler>, GenericChildren extends GenericParent>(): KindIdentifier<GenericParent, GenericChildren>;
export {};
