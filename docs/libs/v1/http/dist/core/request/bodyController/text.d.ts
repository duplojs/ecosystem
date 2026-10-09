import { BodyControllerParams } from './base';
import * as DCommon from "@duplojs-v1/lang/common";
export interface TextBodyReaderParams extends BodyControllerParams {
}
export declare const TextBodyController: import('./base').BodyControllerHandler<"text", TextBodyReaderParams>;
export type TextBodyController = typeof TextBodyController;
export interface ControlBodyAsTextParams {
    bodyMaxSize?: number | DCommon.BytesInString;
}
export declare function controlBodyAsText(params?: ControlBodyAsTextParams): import('./base').BodyController<"text", TextBodyReaderParams>;
