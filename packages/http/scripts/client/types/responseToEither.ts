import type * as DEither from "@duplojs/lang/either";
import { type AllClientResponse } from "./clientResponse";
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import { type RequestErrorContent } from "@client/unexpectedResponseError";

export type ResponseToEitherByInformation<
	GenericHookParams extends Record<string, unknown>,
	GenericClientResponse extends AllClientResponse<GenericHookParams>,
	GenericSelector extends Record<
		Extract<GenericClientResponse["information"], string>,
		boolean
	>,
> = (
	| DCommon.NeverCoalescing<
		DObject.Values<{
			[
			Prop in Extract<
				keyof GenericSelector,
				string
			>
			]: (
				| (
					DCommon.Or<[
						DCommon.IsEqual<GenericSelector[Prop], true>,
						DCommon.IsEqual<GenericSelector[Prop], boolean>,
					]> extends true
						? DEither.Right<
							Prop,
							DCommon.NeverCoalescing<
								Extract<
									GenericClientResponse,
									{ information: Prop }
								>,
								AllClientResponse<GenericHookParams>
							>
						>
						: never
				)
				| (
					DCommon.Or<[
						DCommon.IsEqual<GenericSelector[Prop], false>,
						DCommon.IsEqual<GenericSelector[Prop], boolean>,
					]> extends true
						? DEither.Left<
							"unexpect-response",
							DCommon.NeverCoalescing<
								Extract<
									GenericClientResponse,
									{ information: Prop }
								>,
								AllClientResponse<GenericHookParams>
							>
						>
						: never
				)
			)
		}>,
		DEither.Right<
			string,
			AllClientResponse<GenericHookParams>
		>
	>
	| DEither.Left<
		"unexpect-response",
		AllClientResponse<GenericHookParams>
	>
	| DEither.Left<
		"request-error",
		RequestErrorContent
	>
);

export type ResponseToEitherByCode<
	GenericHookParams extends Record<string, unknown>,
	GenericClientResponse extends AllClientResponse<GenericHookParams>,
	GenericSelector extends Record<
		GenericClientResponse["code"],
		boolean
	>,
> = (
	| DCommon.NeverCoalescing<
		DObject.Values<{
			[
			Prop in Extract<
				keyof GenericSelector,
				string | number
			>
			]: (
				| (
					DCommon.Or<[
						DCommon.IsEqual<GenericSelector[Prop], true>,
						DCommon.IsEqual<GenericSelector[Prop], boolean>,
					]> extends true
						? DEither.Right<
							`response-${Prop}`,
							DCommon.NeverCoalescing<
								Extract<
									GenericClientResponse,
									{ code: `${Prop}` }
								>,
								AllClientResponse<GenericHookParams>
							>
						>
						: never
				)
				| (
					DCommon.Or<[
						DCommon.IsEqual<GenericSelector[Prop], false>,
						DCommon.IsEqual<GenericSelector[Prop], boolean>,
					]> extends true
						? DEither.Left<
							"unexpect-response",
							DCommon.NeverCoalescing<
								Extract<
									GenericClientResponse,
									{ code: `${Prop}` }
								>,
								AllClientResponse<GenericHookParams>
							>
						>
						: never
				)
			)
		}>,
		DEither.Right<`response-${number}`, AllClientResponse<GenericHookParams>>
	>
	| DEither.Left<
		"unexpect-response",
		AllClientResponse<GenericHookParams>
	>
	| DEither.Left<
		"request-error",
		RequestErrorContent
	>
);
