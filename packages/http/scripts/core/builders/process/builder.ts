import { type ProcessDefinition } from "@core/process";
import { type Floor } from "@core/types";
import * as DCommon from "@duplojs/lang/common";
import { type HookRouteLifeCycle } from "@core/route";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";
import { type Metadata } from "@core/metadata";

export interface ProcessBuilder<
	GenericDefinition extends ProcessDefinition = ProcessDefinition,
	GenericFloor extends Floor = {},
> extends DCommon.Builder<ProcessDefinition> {

}

export const processBuilder = DCommon.createBuilder<ProcessBuilder>(
	createCoreLibStringIdentifier("process"),
);

export function useProcessBuilder<
	GenericOptions extends ProcessDefinition["options"] = never,
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
	const GenericMetadata extends readonly Metadata[] = readonly [],
>(
	params?: {
		options?: GenericOptions;
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
		metadata?: GenericMetadata;
	},
): ProcessBuilder<
	{
		readonly steps: readonly [];
		readonly options: DCommon.NeverCoalescing<GenericOptions, undefined>;
		readonly hooks: GenericHooks;
		readonly metadata: GenericMetadata;
	},
	DCommon.IsEqual<GenericOptions, never> extends true
		? {}
		: { options: GenericOptions }
> {
	return processBuilder.use({
		options: undefined,
		...params,
		steps: [],
		hooks: params?.hooks ?? [],
		metadata: params?.metadata ?? [],
	});
}
