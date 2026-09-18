import * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import { createKind } from "./kind";
import { type GetCheckerInput, type Checker, type GetCheckerOptions, type GetCheckerResult } from "./checker";
import { type ClientErrorResponseCode, type ResponseContract } from "./response";
import type * as DKind from "@duplojs/lang/kind";

export interface PresetCheckerDefinition {
	readonly checker: Checker;
	readonly result: string | readonly string[];
	readonly indexing?: string;
	rewriteInput?(input: unknown): unknown;
	readonly options?: Record<string, unknown>;
	readonly responseContract: ResponseContract.Contract<ClientErrorResponseCode>;
}

export const presetCheckerKind = createKind("preset-checker");

export interface PresetChecker<
	GenericDefinition extends PresetCheckerDefinition = PresetCheckerDefinition,
> extends DKind.Kind<typeof presetCheckerKind> {
	readonly definition: GenericDefinition;
	indexing<
		GenericIndex extends string,
	>(
		indexing: GenericIndex
	): PresetChecker<
		DObject.Assign<
			GenericDefinition,
			{ readonly indexing: GenericIndex }
		>
	>;
	rewriteInput<
		GenericInput extends unknown,
	>(
		rewriteInput: (input: GenericInput) => GetCheckerInput<GenericDefinition["checker"]>
	): PresetChecker<
		DObject.Assign<
			GenericDefinition,
			{ rewriteInput(input: GenericInput): GetCheckerInput<GenericDefinition["checker"]> }
		>
	>;
	options<
		const GenericOptions extends GetCheckerOptions<GenericDefinition["checker"]>,
	>(
		options: GenericOptions
	): PresetChecker<
		DObject.Assign<
			GenericDefinition,
			{ readonly options: GenericOptions }
		>
	>;
}

export function createPresetChecker<
	GenericChecker extends Checker,
	const GenericDefinition extends {
		result: DCommon.MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>;
		indexing?: string;
		rewriteInput?(input: unknown): GetCheckerInput<GenericChecker>;
		options?: GetCheckerOptions<GenericChecker>;
		otherwise: ResponseContract.Contract<ClientErrorResponseCode>;
	},
>(
	checker: GenericChecker,
	{ otherwise, ...definition }: GenericDefinition,
): PresetChecker<
	DObject.Assign<
		Omit<GenericDefinition, "otherwise">,
		{
			readonly checker: GenericChecker;
			readonly responseContract: GenericDefinition["otherwise"];
		}
	>
> {
	return DCommon.pipe(
		{
			definition: {
				...definition,
				checker,
				responseContract: otherwise,

			},
			indexing(indexing) {
				return createPresetChecker(
					checker,
					{
						...definition,
						indexing,
						otherwise,
					},
				);
			},
			rewriteInput(rewriteInput) {
				return createPresetChecker(
					checker,
					{
						...definition,
						rewriteInput,
						otherwise,
					},
				);
			},
			options(options) {
				return createPresetChecker(
					checker,
					{
						...definition,
						options,
						otherwise,
					},
				);
			},
		} satisfies DKind.Remove<PresetChecker>,
		(value) => presetCheckerKind.setTo(value, null),
	) as never;
}

export type GetPresetCheckerInput<
	GenericPresetChecker extends PresetChecker,
> = GenericPresetChecker["definition"]["rewriteInput"] extends DCommon.AnyFunction
	? Parameters<GenericPresetChecker["definition"]["rewriteInput"]>[0]
	: Parameters<GenericPresetChecker["definition"]["checker"]["definition"]["theFunction"]>[0];

export type GetPresetCheckerResult<
	GenericPresetChecker extends PresetChecker,
> = ReturnType<GenericPresetChecker["definition"]["checker"]["definition"]["theFunction"]>;

export type GetPresetCheckerIndex<
	GenericPresetChecker extends PresetChecker,
> = GenericPresetChecker["definition"]["indexing"] extends string
	? GenericPresetChecker["definition"]["indexing"]
	: never;

export type GetPresetCheckerInformation<
	GenericPresetChecker extends PresetChecker,
> = GenericPresetChecker["definition"]["result"];
