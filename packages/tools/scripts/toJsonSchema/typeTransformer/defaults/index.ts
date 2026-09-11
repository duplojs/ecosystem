export * from "./string";
export * from "./stringLiteral";
export * from "./number";
export * from "./numberLiteral";
export * from "./boolean";
export * from "./booleanLiteral";
export * from "./bigint";
export * from "./bigintLiteral";
export * from "./undefined";
export * from "./null";

import type { TypeTransformer } from "../create";

import { stringTypeTransformer } from "./string";
import { stringLiteralTypeTransformer } from "./stringLiteral";
import { numberTypeTransformer } from "./number";
import { numberLiteralTypeTransformer } from "./numberLiteral";
import { booleanTypeTransformer } from "./boolean";
import { booleanLiteralTypeTransformer } from "./booleanLiteral";
import { bigintTypeTransformer } from "./bigint";
import { bigintLiteralTypeTransformer } from "./bigintLiteral";
import { undefinedTypeTransformer } from "./undefined";
import { nullTypeTransformer } from "./null";

export const defaultTypeTransformers = [
	stringTypeTransformer,
	stringLiteralTypeTransformer,
	numberTypeTransformer,
	numberLiteralTypeTransformer,
	booleanTypeTransformer,
	booleanLiteralTypeTransformer,
	bigintTypeTransformer,
	bigintLiteralTypeTransformer,
	undefinedTypeTransformer,
	nullTypeTransformer,
] as const satisfies readonly TypeTransformer[];
