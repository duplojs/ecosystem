import { Left } from './left';
import { GetInformation, GetValue } from './types';
import * as DCommon from '../common';
import type * as DKind from '../kind';
type ErrorIdentifier<GenericInput extends unknown> = DKind.GetValue<typeof DCommon.duploJSErrorKind, Extract<GetValue<Extract<GenericInput, Left>>, DCommon.DuploJSError>>;
type ExtractErrorInLeftOutput<GenericInput extends unknown, GenericErrorIdentifier extends string> = Extract<GenericInput extends Left ? Extract<GetValue<GenericInput>, DCommon.DuploJSError<GenericErrorIdentifier>> extends infer InferredError extends DCommon.DuploJSError ? DCommon.IsNever<InferredError> extends true ? GenericInput : ((DCommon.IsNever<Exclude<GetValue<GenericInput>, InferredError>> extends true ? never : Left<GetInformation<GenericInput>, Exclude<GetValue<GenericInput>, InferredError>>) | (InferredError extends DCommon.DuploJSError ? Left<DKind.GetValue<typeof DCommon.duploJSErrorKind, InferredError>, InferredError> : never)) : never : GenericInput, any>;
export declare function extractErrorInLeft<GenericInput extends unknown, GenericErrorIdentifier extends ErrorIdentifier<GenericInput>>(errorIdentifier: GenericErrorIdentifier | GenericErrorIdentifier[]): (input: GenericInput) => ExtractErrorInLeftOutput<GenericInput, GenericErrorIdentifier>;
export declare function extractErrorInLeft<GenericInput extends unknown, GenericErrorIdentifier extends ErrorIdentifier<GenericInput>>(input: GenericInput, errorIdentifier: GenericErrorIdentifier | GenericErrorIdentifier[]): ExtractErrorInLeftOutput<GenericInput, GenericErrorIdentifier>;
export {};
