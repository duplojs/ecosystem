import * as DCommon from "@duplojs/lang/common";
import { type BodyControllerParams, createBodyController } from "./base";

export interface FormDataBodyReaderParams extends BodyControllerParams {
	maxFileQuantity: number;
	mimeType?: RegExp;
	fileMaxSize?: number;
	textFieldMaxSize?: number;
	maxBufferSize: number;
	maxIndexArray: number;
	maxKeyLength: number;
}

export const FormDataBodyController = createBodyController<
	"formData",
	FormDataBodyReaderParams
>("formData");
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

export function controlBodyAsFormData(
	params: ControlBodyAsFormDataParams,
) {
	return FormDataBodyController.create({
		maxFileQuantity: params.maxFileQuantity,
		bodyMaxSize: params.bodyMaxSize && DCommon.stringToBytes(params.bodyMaxSize),
		fileMaxSize: params.fileMaxSize && DCommon.stringToBytes(params.fileMaxSize),
		textFieldMaxSize: params.textFieldMaxSize && DCommon.stringToBytes(params.textFieldMaxSize),
		mimeType: params.mimeType !== undefined
			? DCommon.toRegExp(params.mimeType)
			: undefined,
		maxBufferSize: params.maxBufferSize !== undefined
			? DCommon.stringToBytes(params.maxBufferSize)
			: DCommon.stringToBytes("128kb"),
		maxIndexArray: params.maxIndexArray !== undefined
			? params.maxIndexArray
			: 500,
		maxKeyLength: params.maxKeyLength !== undefined
			? params.maxKeyLength
			: 500,
	});
}
