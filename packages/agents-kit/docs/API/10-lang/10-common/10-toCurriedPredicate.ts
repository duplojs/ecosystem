/**
 * @title DCommon.toCurriedPredicate
 *
 * Adapter un prédicat non générique vers la forme curifiée attendue par une fonction.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

declare const input: string | number;

const isString = (value: string | number): value is string => (
	typeof value === "string"
);

const result = DCommon.pipe(
	input,
	DCommon.when(
		DCommon.toCurriedPredicate(isString),
		DString.toUpperCase,
	),
);

// Le prédicat unaire est adapté à une API qui attend un predicate curifié.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	number | Uppercase<string>,
	"strict"
>;
