import type * as DString from "@scripts/string";

export type Hour = `${"0" | "1"}${DString.Digit}` | "20" | "21" | "22" | "23";

export type Minute = `${"0" | "1" | "2" | "3" | "4" | "5"}${DString.Digit}`;

export type Second = `${"0" | "1" | "2" | "3" | "4" | "5"}${DString.Digit}`;

export type Millisecond = `${DString.Digit}${DString.Digit}${DString.Digit}`;
