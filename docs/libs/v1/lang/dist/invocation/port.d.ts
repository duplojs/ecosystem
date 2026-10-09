import type * as DKind from '../kind';
export declare const portHandlerKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/port-handler", unknown>>;
export interface PortHandler<GenericPort extends unknown = unknown> extends DKind.Kind<typeof portHandlerKind> {
    createImplementation(implementation: GenericPort): GenericPort;
}
export declare function createPort<GenericPort extends unknown>(): PortHandler<GenericPort>;
