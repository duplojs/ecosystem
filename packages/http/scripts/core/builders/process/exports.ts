import { type Floor } from "@core/types";
import type * as DCommon from "@duplojs/lang/common";
import { processBuilder } from "./builder";
import { type Process, type ProcessExportValue, type ProcessDefinition, createProcess } from "@core/process";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		exports<
			GenericExportation extends (keyof GenericFloor)[] = never,
		>(
			exportedKey?: GenericExportation
		): Process<
			DCommon.SimplifyTopLevel<
				& GenericDefinition
				& (
					DCommon.Or<[
						DCommon.IsEqual<GenericExportation, never>,
						DCommon.IsEqual<GenericExportation, never[]>,
					]> extends true
						? {}
						: ProcessExportValue<
							DCommon.SimplifyTopLevel<
								Pick<
									GenericFloor,
									GenericExportation[number]
								>
							>
						>
				)
			>
		>;
	}
}

processBuilder.set(
	"exports",
	({
		accumulator,
	}) => createProcess(accumulator),
);
