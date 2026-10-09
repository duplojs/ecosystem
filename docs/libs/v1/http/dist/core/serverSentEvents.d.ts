import { Stream } from './stream';
import * as DCommon from "@duplojs-v1/lang/common";
export declare namespace ServerSentEvents {
    type DefinitionShape = Record<string, unknown>;
    interface SendParams {
        id?: string;
        retry?: number | DCommon.TimeInString;
    }
    interface StartSendingParams<GenericEvents extends DefinitionShape = DefinitionShape> extends Stream.StartSendingParams {
        send(...args: {
            [Event in keyof GenericEvents]: [
                event: Event,
                ...(GenericEvents[Event] extends undefined ? [data?: GenericEvents[Event]] : [data: GenericEvents[Event]]),
                params?: SendParams
            ];
        }[keyof GenericEvents]): Promise<void>;
        readonly lastId: string | null;
    }
    interface InitParams {
        readonly lastId: string | null;
    }
    function init(startSendingEvents: (params: StartSendingParams) => DCommon.MaybePromise<void>, initParams: InitParams): Stream.Handler;
}
