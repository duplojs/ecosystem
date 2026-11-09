import * as DCommon from "@scripts/common";

export const Back = DCommon.createEnum(["LF", "CRLF"]);

export type Back = DCommon.GetEnumValue<typeof Back>;
