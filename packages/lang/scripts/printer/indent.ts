import * as DCommon from "@scripts/common";

export const Indent = DCommon.createEnum(["tab", "space1", "space2", "space3", "space4"]);

export type Indent = DCommon.GetEnumValue<typeof Indent>;
