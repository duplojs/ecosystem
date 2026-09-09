import { type Constraint } from "../base";
import type * as DDefaults from "../defaults";

export interface ConstraintsStore {
	allowedCharacters: DDefaults.AllowedCharactersConstraint;
	email: DDefaults.EmailConstraint;
	url: DDefaults.UrlConstraint;
	uuid: DDefaults.UuidConstraint;
	trimmed: DDefaults.TrimmedConstraint;
	notEmpty: DDefaults.NotEmptyConstraint;
	regex: DDefaults.RegexConstraint;
	minCharacters: DDefaults.MinCharactersConstraint;
	maxCharacters: DDefaults.MaxCharactersConstraint;
	numberInString: DDefaults.NumberInStringConstraint;
	stringLengthEqual: DDefaults.StringLengthEqualConstraint;

	minElements: DDefaults.MinElementsConstraint;
	maxElements: DDefaults.MaxElementsConstraint;
	arrayLengthEqual: DDefaults.ArrayLengthEqualConstraint;

	integer: DDefaults.IntegerConstraint;
	even: DDefaults.EvenConstraint;
	multipleOf: DDefaults.MultipleOfConstraint;
	negative: DDefaults.NegativeConstraint;
	notZero: DDefaults.NotZeroConstraint;
	odd: DDefaults.OddConstraint;
	positive: DDefaults.PositiveConstraint;
	safe: DDefaults.SafeConstraint;
	strictNegative: DDefaults.StrictNegativeConstraint;
	strictPositive: DDefaults.StrictPositiveConstraint;
	betweenThan: DDefaults.BetweenThanConstraint;
	betweenThanOrEqual: DDefaults.BetweenThanOrEqualConstraint;
	greaterThan: DDefaults.GreaterThanConstraint;
	greaterThanOrEqual: DDefaults.GreaterThanOrEqualConstraint;
	lessThan: DDefaults.LessThanConstraint;
	lessThanOrEqual: DDefaults.LessThanOrEqualConstraint;

	absolutePath: DDefaults.AbsolutePathConstraint;
	path: DDefaults.PathConstraint;
	segmentPath: DDefaults.SegmentPathConstraint;

	refine: DDefaults.RefineConstraint;
}

export type Constraints = Extract<
	ConstraintsStore[keyof ConstraintsStore],
	Constraint
>;
