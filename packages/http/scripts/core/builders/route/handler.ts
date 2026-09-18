import { type Floor } from "@core/types";
import { type ResponseContract } from "@core/response";
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
			GenericResponseContract extends (
				| ResponseContract.Contracts
				| readonly [
					ResponseContract.Contracts,
					...ResponseContract.Contracts[],
				]
			),
			GenericResponse extends ResponseContract.Convert<
				GenericResponseContract extends readonly any[]
					? GenericResponseContract[number]
					: GenericResponseContract
			>,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			responseContract: GenericResponseContract,
			theFunction: (
				floor: GenericFloor,
				params: HandlerStepFunctionParams<
					GenericResponse
				>,
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
								readonly responseContract: GenericResponseContract;
								theFunction(
									floor: GenericFloor,
									params: HandlerStepFunctionParams<
										GenericResponse
									>
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
			responseContract,
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
					responseContract,
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
