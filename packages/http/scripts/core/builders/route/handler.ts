import { type Floor } from "@core/types";
import { type PredictedResponses } from "@core/response";
import { createRoute, type Route, type RouteDefinition } from "@core/route";
import { createHandlerStep, type HandlerStep, type HandlerStepFunctionParams } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import * as DArray from "@duplojs/lang/array";
import { routeBuilderHandler } from "./builder";
import { routeStore } from "./store";
import { type Metadata, IgnoreByRouteStoreMetadata } from "@core/metadata";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
	> {
		handler<
			const GenericResponse extends PredictedResponses,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			theFunction: (
				floor: GenericFloor,
				params: HandlerStepFunctionParams,
			) => DCommon.MaybePromise<GenericResponse>,
			...metadata: GenericMetadata,
		): Route<
			DObject.Assign<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						HandlerStep<
							{
								theFunction(
									floor: GenericFloor,
									params: HandlerStepFunctionParams
								): DCommon.MaybePromise<GenericResponse>;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>
		>;
	}
}

routeBuilderHandler.set(
	"handler",
	({
		args: [
			theFunction,
			...metadata
		],
		accumulator,
	}) => {
		const route = createRoute({
			...accumulator,
			steps: [
				...accumulator.steps,
				createHandlerStep({
					theFunction,
					metadata,
				}),
			] as const,
		});

		const ignoreByRouteStoreMetadata = DArray.find(
			accumulator.metadata,
			IgnoreByRouteStoreMetadata.is,
		);

		if (
			ignoreByRouteStoreMetadata === undefined
		) {
			routeStore.add(route);
		}

		return route;
	},
);
