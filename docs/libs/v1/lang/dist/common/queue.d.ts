import * as DEither from '../either';
import type * as DKind from '../kind';
export declare const queueKind: DKind.Handler<DKind.Definition<"@DuplojsLangCommon/queue", unknown>>;
export interface Queue extends DKind.Kind<typeof queueKind> {
    add<GenericOutput extends unknown>(task: () => GenericOutput): Promise<Awaited<GenericOutput> | DEither.Left<"execution-error", unknown>>;
    addExternal(): Promise<() => void>;
}
export interface CreateQueueParams {
    concurrency?: number;
}
export declare function createQueue(params?: CreateQueueParams): Queue;
