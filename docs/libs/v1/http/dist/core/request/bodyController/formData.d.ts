import { BodyControllerParams } from './base';
import * as DCommon from "@duplojs-v1/lang/common";
export interface FormDataBodyReaderParams extends BodyControllerParams {
    maxFileQuantity: number;
    mimeType?: RegExp;
    fileMaxSize?: number;
    textFieldMaxSize?: number;
    maxBufferSize: number;
    maxIndexArray: number;
    maxKeyLength: number;
}
export declare const FormDataBodyController: import('./base').BodyControllerHandler<"formData", FormDataBodyReaderParams>;
export type FormDataBodyController = typeof FormDataBodyController;
export interface ControlBodyAsFormDataParams {
    maxFileQuantity: number;
    mimeType?: string | DCommon.AnyTuple<string> | RegExp;
    bodyMaxSize?: number | DCommon.BytesInString;
    fileMaxSize?: number | DCommon.BytesInString;
    textFieldMaxSize?: number | DCommon.BytesInString;
    maxBufferSize?: number | DCommon.BytesInString;
    maxIndexArray?: number;
    maxKeyLength?: number;
}
export declare function controlBodyAsFormData(params: ControlBodyAsFormDataParams): import('./base').BodyController<"formData", FormDataBodyReaderParams>;
