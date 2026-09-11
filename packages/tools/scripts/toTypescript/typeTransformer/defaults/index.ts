import type { TypeTransformer } from "../create";
import { bigintTypeTransformer } from "./bigint";
import { bigintLiteralTypeTransformer } from "./bigintLiteral";
import { booleanTypeTransformer } from "./boolean";
import { booleanLiteralTypeTransformer } from "./booleanLiteral";
import { dateTypeTransformer } from "./date";
import { nullTypeTransformer } from "./null";
import { numberTypeTransformer } from "./number";
import { numberLiteralTypeTransformer } from "./numberLiteral";
import { stringTypeTransformer } from "./string";
import { stringLiteralTypeTransformer } from "./stringLiteral";
import { timeTypeTransformer } from "./time";
import { undefinedTypeTransformer } from "./undefined";

export * from "./bigint";
export * from "./bigintLiteral";
export * from "./boolean";
export * from "./booleanLiteral";
export * from "./date";
export * from "./null";
export * from "./number";
export * from "./numberLiteral";
export * from "./string";
export * from "./stringLiteral";
export * from "./time";
export * from "./undefined";

export const defaultTypeTransformers = [
	bigintTypeTransformer,
	bigintLiteralTypeTransformer,
	booleanTypeTransformer,
	booleanLiteralTypeTransformer,
	dateTypeTransformer,
	nullTypeTransformer,
	numberTypeTransformer,
	numberLiteralTypeTransformer,
	stringTypeTransformer,
	stringLiteralTypeTransformer,
	timeTypeTransformer,
	undefinedTypeTransformer,
] as const satisfies readonly TypeTransformer[];
