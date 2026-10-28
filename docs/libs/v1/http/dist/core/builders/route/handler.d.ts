import { Floor } from '../../types';
import { PredictedResponses } from '../../response';
import { Route, RouteDefinition } from '../../route';
import { HandlerStep, HandlerStepFunctionParams } from '../../steps';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> {
        handler<const GenericResponse extends PredictedResponses, const GenericMetadata extends readonly Metadata[] = readonly []>(theFunction: (floor: GenericFloor, params: HandlerStepFunctionParams) => DCommon.MaybePromise<GenericResponse>, ...metadata: GenericMetadata): Route<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                HandlerStep<{
                    theFunction(floor: GenericFloor, params: HandlerStepFunctionParams): DCommon.MaybePromise<GenericResponse>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>>;
    }
}
