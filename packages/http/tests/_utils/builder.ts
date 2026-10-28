import { type RouteBuilder, type ProcessBuilder } from "@core";
import * as DCommon from "@duplojs/lang/common";

export function getBuilderDefinition<GenericBuilder extends RouteBuilder | ProcessBuilder>(builder: GenericBuilder) {
	return DCommon.builderKind.getValue(builder) as GenericBuilder extends RouteBuilder<infer Definition>
		? Definition
		: GenericBuilder extends ProcessBuilder<infer Definition>
			? Definition
			: never;
}
