import { createKind } from "@core/kind";
import * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DObject from "@duplojs/lang/object";
import { type StepKind, stepKind } from "./kind";
import { type Request } from "@core/request";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

export interface DisabledExtractKeysCustom {

}

export type DisabledExtractKeys = DObject.GetPropsWithValue<
	DisabledExtractKeysCustom,
	true
>;

export type ExtractShape<
	GenericRequest extends Request = Request,
> = Partial<
	& Record<
		Exclude<
			keyof GenericRequest,
			| DObject.GetPropsWithValueExtends<
				GenericRequest,
				DCommon.AnyFunction
			>
			// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
			| DisabledExtractKeys
			| "body"
			| "bodyReader"
			| "params"
			| symbol
		>,
		| DDataStructure.Structure
		| Record<string, DDataStructure.Structure>
	>
	& {
		body: (
			| DDataStructure.Structure
			| Record<string, DDataStructure.Structure>
		);
		params: Record<string, DDataStructure.Structure>;
	}
>;

export type ExtractShapeCodecs = Partial<
	Record<
		Exclude<
			keyof ExtractShape,
			"body"
		>,
		DDataStructure.Codecs
	>
>;

export interface ExtractStepDefinition {
	readonly shape: ExtractShape;
	readonly responseContract?: ResponseContract.Contract<
		ClientErrorResponseCode,
		string,
		DDataStructure.Structure<undefined>
	>;
	readonly metadata: readonly Metadata[];
}

export const extractStepKind = createKind("extract-step");

export interface ExtractStep<
	GenericDefinition extends ExtractStepDefinition = ExtractStepDefinition,
> extends DCommon.Forward<
	& DKind.Kind<typeof extractStepKind>
	& StepKind
	> {
	readonly definition: GenericDefinition;
}

export function createExtractStep<
	GenericDefinition extends ExtractStepDefinition,
>(
	definition: GenericDefinition,
): ExtractStep<GenericDefinition> {
	return DCommon.pipe(
		{ definition },
		(value) => extractStepKind.setTo(value, null),
		(value) => stepKind.setTo(value, null),
	);
}
