import { Floor } from '../../types';
import { Process, ProcessExportValue, ProcessDefinition } from '../../process';
import type * as DCommon from "@duplojs-v1/lang/common";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> {
        exports<GenericExportation extends (keyof GenericFloor)[] = never>(exportedKey?: GenericExportation): Process<DCommon.SimplifyTopLevel<GenericDefinition & (DCommon.Or<[
            DCommon.IsEqual<GenericExportation, never>,
            DCommon.IsEqual<GenericExportation, never[]>
        ]> extends true ? {} : ProcessExportValue<DCommon.SimplifyTopLevel<Pick<GenericFloor, GenericExportation[number]>>>)>>;
    }
}
