/**
 * @title DEither.matchInformationCombinationOtherwise
 *
 * Traiter les combinaisons d’informations choisies et fournir un cas de repli.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

type Combination = readonly [
	DEither.Success<42> | DEither.Error<"message">,
	DEither.Right<"found", 1> | DEither.Left<"missing", undefined>,
];

declare const combination: Combination;

// Appel classique : traiter success/found et transmettre les autres cas au repli.
const direct = DEither.matchInformationCombinationOtherwise(
	combination,
	{
		"success/found": (values) => {
			type _CheckValues = DCommon.ExpectType<typeof values, readonly [42, 1], "strict">;
			return values;
		},
	},
	(values) => {
		type _CheckRemaining = DCommon.ExpectType<
			typeof values,
			| readonly [DEither.Success<42>, DEither.Left<"missing", undefined>]
			| readonly [DEither.Error<"message">, DEither.Right<"found", 1>]
			| readonly [DEither.Error<"message">, DEither.Left<"missing", undefined>],
			"strict"
		>;
		return values;
	},
);
type _CheckDirect = DCommon.ExpectType<
	typeof direct,
	| readonly [42, 1]
	| readonly [DEither.Success<42>, DEither.Left<"missing", undefined>]
	| readonly [DEither.Error<"message">, DEither.Right<"found", 1>]
	| readonly [DEither.Error<"message">, DEither.Left<"missing", undefined>],
	"strict"
>;

// Appel curifié : la sélection et le repli sont configurés dans le pipe.
const piped = DCommon.pipe(
	combination,
	DEither.matchInformationCombinationOtherwise(
		{
			"error/missing": (values) => values,
		},
		(values) => values,
	),
);
type _CheckPiped = DCommon.ExpectType<
	typeof piped,
	| readonly [DEither.Success<42>, DEither.Right<"found", 1>]
	| readonly [DEither.Success<42>, DEither.Left<"missing", undefined>]
	| readonly [DEither.Error<"message">, DEither.Right<"found", 1>]
	| readonly ["message", undefined],
	"strict"
>;
