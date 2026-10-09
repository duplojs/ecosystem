import { Floor } from '../../types';
import { RouteDefinition } from '../../route';
import { ProcessStep } from '../../steps';
import { GetProcessExportValue, Process } from '../../process';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> {
        exec<GenericProcess extends Process, GenericProcessExportValue extends GetProcessExportValue<GenericProcess>, const GenericImportation extends readonly Extract<keyof GenericProcessExportValue, string>[] = never, GenericOptions extends (GenericProcess["definition"]["options"] | ((floor: GenericFloor) => Exclude<GenericProcess["definition"]["options"], undefined>)) = never, const GenericMetadata extends readonly Metadata[] = readonly []>(process: GenericProcess, params?: {
            readonly imports?: GenericImportation;
            readonly options?: DCommon.FixDeepFunctionInfer<GenericProcess["definition"]["options"] | ((floor: GenericFloor) => GenericProcess["definition"]["options"]), GenericOptions>;
        }, ...metadata: GenericMetadata): RouteBuilder<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                ProcessStep<{
                    readonly process: GenericProcess;
                    readonly options: DCommon.NeverCoalescing<Extract<GenericOptions, DCommon.AnyFunction | GenericProcess["definition"]["options"]>, undefined>;
                    readonly imports: DCommon.NeverCoalescing<GenericImportation, undefined>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, DObject.Assign<GenericFloor, Pick<GenericProcessExportValue, GenericImportation[number]>>>;
    }
}
