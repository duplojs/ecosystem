import { Floor } from '../../types';
import { ResponseContract } from '../../response';
import { Route, RouteDefinition } from '../../route';
import { HandlerStep, HandlerStepFunctionParams } from '../../steps';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> {
        handler<GenericResponseContract extends (ResponseContract.Contracts | readonly [
            ResponseContract.Contracts,
            ...ResponseContract.Contracts[]
        ]), GenericResponse extends ResponseContract.Convert<GenericResponseContract extends readonly any[] ? GenericResponseContract[number] : GenericResponseContract>, const GenericMetadata extends readonly Metadata[] = readonly []>(responseContract: GenericResponseContract, theFunction: (floor: GenericFloor, params: HandlerStepFunctionParams<GenericResponse>) => DCommon.MaybePromise<GenericResponse>, ...metadata: GenericMetadata): Route<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                HandlerStep<{
                    readonly responseContract: GenericResponseContract;
                    theFunction(floor: GenericFloor, params: HandlerStepFunctionParams<GenericResponse>): DCommon.MaybePromise<GenericResponse>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>>;
    }
}
