import { type Type } from "../base";
import type {
	BigintLiteralType,
	BigintType,
	BooleanLiteralType,
	BooleanType,
	DateType,
	NullType,
	NumberLiteralType,
	NumberType,
	StringLiteralType,
	StringType,
	TimeType,
	UndefinedType,
} from "../defaults";

export interface TypesStore {
	bigint: BigintType;
	bigintLiteral: BigintLiteralType;
	boolean: BooleanType;
	booleanLiteral: BooleanLiteralType;
	date: DateType;
	null: NullType;
	number: NumberType;
	numberLiteral: NumberLiteralType;
	string: StringType;
	stringLiteral: StringLiteralType;
	time: TimeType;
	undefined: UndefinedType;
}

export type Types = Extract<TypesStore[keyof TypesStore], Type>;
