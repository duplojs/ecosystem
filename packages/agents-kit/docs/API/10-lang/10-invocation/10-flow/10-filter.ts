/**
 * @title DInvocation.filter
 *
 * Poursuivre un flow avec une valeur ou l'interrompre sur un Left.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import * as DNumber from "@duplojs/lang/number";
import * as DString from "@duplojs/lang/string";
import type * as DCommon from "@duplojs/lang/common";

declare function format(value: number): string;

const process = DInvocation.flow(
	DInvocation.filter((input: number) => DNumber.greaterThan(input, 0)
		? DEither.success(input)
		: DEither.left("invalid", undefined)),
	format,
);
// Le Right est déballé pour l'étape suivante ; le Left est retourné sans l'exécuter.
const result = process(42);
type _CheckResult = DCommon.ExpectType<
	typeof result,
	Promise<string | DEither.Left<"invalid", undefined>>,
	"strict"
>;

// Une valeur brute poursuit aussi le flow, sans passer par un Either.
const transform = DInvocation.flow(
	DInvocation.filter((input: string) => DString.length(DString.trim(input))),
);
const length = transform("flow");
type _CheckLength = DCommon.ExpectType<
	typeof length,
	Promise<number & DNumber.Positive>,
	"strict"
>;
