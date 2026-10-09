import { PortHandler } from './port';
import * as DCommon from '../common';
import type * as DKind from '../kind';
type FormatPortName<GenericValue extends string> = Uncapitalize<GenericValue> extends infer InferredResult extends string ? InferredResult extends `${infer InferredName}Port` ? InferredName : InferredResult : never;
export type ReaderDependencies = Record<string, Reader | PortHandler>;
export type ReaderDependenciesValue<GenericDependencies extends ReaderDependencies> = DCommon.SimplifyTopLevel<{
    [Prop in keyof GenericDependencies as (GenericDependencies[Prop] extends PortHandler ? FormatPortName<Extract<Prop, string>> : Uncapitalize<Extract<Prop, string>>)]: GenericDependencies[Prop] extends PortHandler ? ReturnType<GenericDependencies[Prop]["createImplementation"]> : GenericDependencies[Prop] extends Reader ? ReturnType<GenericDependencies[Prop]["run"]> : never;
}>;
export type GetAllPorts<GenericDependenciesValue extends ReaderDependencies> = GenericDependenciesValue extends any ? ({
    [Prop in keyof GenericDependenciesValue]: (GenericDependenciesValue[Prop] extends PortHandler ? [
        FormatPortName<Extract<Prop, string>>,
        ReturnType<GenericDependenciesValue[Prop]["createImplementation"]>
    ] : GenericDependenciesValue[Prop] extends Reader ? GetAllPorts<GenericDependenciesValue[Prop]["dependencies"]> : never);
})[keyof GenericDependenciesValue] : never;
export declare const readerKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/reader", unknown>>;
export interface Reader<GenericDependencies extends ReaderDependencies = ReaderDependencies, GenericOutput extends unknown = unknown> extends DKind.Kind<typeof readerKind> {
    dependencies: GenericDependencies;
    run(ports: DCommon.SimplifyTopLevel<(GetAllPorts<GenericDependencies> extends infer InferredEntriesDependenciesValue extends DCommon.ObjectEntry ? {
        [Entry in InferredEntriesDependenciesValue as Entry[0]]: Entry[1];
    } : never) & ({
        [Prop in keyof GenericDependencies as GenericDependencies[Prop] extends Reader ? Uncapitalize<Extract<Prop, string>> : never]?: GenericDependencies[Prop] extends Reader ? ReturnType<GenericDependencies[Prop]["run"]> : never;
    })>): GenericOutput;
}
export declare function createReader<const GenericDependencies extends ReaderDependencies, GenericOutput extends unknown>(dependencies: GenericDependencies, read: (dependenciesValue: ReaderDependenciesValue<GenericDependencies>) => GenericOutput): Reader<GenericDependencies, GenericOutput>;
export declare function resolveReaders<GenericReaders extends Record<string, Reader>>(readers: GenericReaders, ports: DCommon.SimplifyTopLevel<DCommon.UnionToIntersection<{
    [Prop in keyof GenericReaders]: GetAllPorts<GenericReaders[Prop]["dependencies"]> extends infer InferredEntriesDependenciesValue extends DCommon.ObjectEntry ? {
        [Entry in InferredEntriesDependenciesValue as Entry[0]]: Entry[1];
    } : never;
}[keyof GenericReaders]>>): ReaderDependenciesValue<GenericReaders>;
export {};
