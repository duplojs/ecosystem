export * from "./absolutePath";
export * from "./allowedCharacters";
export * from "./arrayLengthEqual";
export * from "./betweenThan";
export * from "./betweenThanOrEqual";
export * from "./email";
export * from "./even";
export * from "./greaterThan";
export * from "./greaterThanOrEqual";
export * from "./integer";
export * from "./lessThan";
export * from "./lessThanOrEqual";
export * from "./maxCharacters";
export * from "./maxElements";
export * from "./minCharacters";
export * from "./minElements";
export * from "./multipleOf";
export * from "./negative";
export * from "./notEmpty";
export * from "./notZero";
export * from "./odd";
export * from "./path";
export * from "./positive";
export * from "./safe";
export * from "./segmentPath";
export * from "./strictNegative";
export * from "./strictPositive";
export * from "./stringLengthEqual";
export * from "./trimmed";
export * from "./url";
export * from "./uuid";

import type { ConstraintTransformer } from "../create";

import { absolutePathConstraintTransformer } from "./absolutePath";
import { allowedCharactersConstraintTransformer } from "./allowedCharacters";
import { arrayLengthEqualConstraintTransformer } from "./arrayLengthEqual";
import { betweenThanConstraintTransformer } from "./betweenThan";
import { betweenThanOrEqualConstraintTransformer } from "./betweenThanOrEqual";
import { emailConstraintTransformer } from "./email";
import { evenConstraintTransformer } from "./even";
import { greaterThanConstraintTransformer } from "./greaterThan";
import { greaterThanOrEqualConstraintTransformer } from "./greaterThanOrEqual";
import { integerConstraintTransformer } from "./integer";
import { lessThanConstraintTransformer } from "./lessThan";
import { lessThanOrEqualConstraintTransformer } from "./lessThanOrEqual";
import { maxCharactersConstraintTransformer } from "./maxCharacters";
import { maxElementsConstraintTransformer } from "./maxElements";
import { minCharactersConstraintTransformer } from "./minCharacters";
import { minElementsConstraintTransformer } from "./minElements";
import { multipleOfConstraintTransformer } from "./multipleOf";
import { negativeConstraintTransformer } from "./negative";
import { notEmptyConstraintTransformer } from "./notEmpty";
import { notZeroConstraintTransformer } from "./notZero";
import { oddConstraintTransformer } from "./odd";
import { pathConstraintTransformer } from "./path";
import { positiveConstraintTransformer } from "./positive";
import { safeConstraintTransformer } from "./safe";
import { segmentPathConstraintTransformer } from "./segmentPath";
import { strictNegativeConstraintTransformer } from "./strictNegative";
import { strictPositiveConstraintTransformer } from "./strictPositive";
import { stringLengthEqualConstraintTransformer } from "./stringLengthEqual";
import { trimmedConstraintTransformer } from "./trimmed";
import { urlConstraintTransformer } from "./url";
import { uuidConstraintTransformer } from "./uuid";

export const defaultConstraintTransformers = [
	absolutePathConstraintTransformer,
	allowedCharactersConstraintTransformer,
	arrayLengthEqualConstraintTransformer,
	betweenThanConstraintTransformer,
	betweenThanOrEqualConstraintTransformer,
	emailConstraintTransformer,
	evenConstraintTransformer,
	greaterThanConstraintTransformer,
	greaterThanOrEqualConstraintTransformer,
	integerConstraintTransformer,
	lessThanConstraintTransformer,
	lessThanOrEqualConstraintTransformer,
	maxCharactersConstraintTransformer,
	maxElementsConstraintTransformer,
	minCharactersConstraintTransformer,
	minElementsConstraintTransformer,
	multipleOfConstraintTransformer,
	negativeConstraintTransformer,
	notEmptyConstraintTransformer,
	notZeroConstraintTransformer,
	oddConstraintTransformer,
	pathConstraintTransformer,
	positiveConstraintTransformer,
	safeConstraintTransformer,
	segmentPathConstraintTransformer,
	strictNegativeConstraintTransformer,
	strictPositiveConstraintTransformer,
	stringLengthEqualConstraintTransformer,
	trimmedConstraintTransformer,
	urlConstraintTransformer,
	uuidConstraintTransformer,
] as const satisfies readonly ConstraintTransformer[];
