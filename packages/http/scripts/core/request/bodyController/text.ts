import * as DCommon from "@duplojs/lang/common";
import { type BodyControllerParams, createBodyController } from "./base";

export interface TextBodyReaderParams extends BodyControllerParams {

}

export const TextBodyController = createBodyController<
	"text",
	TextBodyReaderParams
>("text");
export type TextBodyController = typeof TextBodyController;

export interface ControlBodyAsTextParams {
	bodyMaxSize?: number | DCommon.BytesInString;
}

export function controlBodyAsText(
	params?: ControlBodyAsTextParams,
) {
	return TextBodyController.create({
		bodyMaxSize: params?.bodyMaxSize && DCommon.stringToBytes(params.bodyMaxSize),
	});
}
