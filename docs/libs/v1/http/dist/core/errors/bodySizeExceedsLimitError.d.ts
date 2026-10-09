import type * as DCommon from "@duplojs-v1/lang/common";
import * as DKind from "@duplojs-v1/lang/kind";
declare const BodySizeExceedsLimitError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/body-size-exceeds-limit-error", unknown>>, ErrorConstructor>;
export declare class BodySizeExceedsLimitError extends BodySizeExceedsLimitError_base {
    bytesInString: DCommon.BytesInString | number;
    constructor(bytesInString: DCommon.BytesInString | number);
}
export {};
