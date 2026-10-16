/**
 * @title DDataStructure.createCodecs
 *
 * Regrouper des codecs dans un contexte indexé par leurs types fondamentaux.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

const numberStringCodec = DDataStructure.createCodec(
	DDataStructure.TheNumber,
	(data): data is string => typeof data === "string",
	(number) => number.toString(),
	(encodedNumber) => Number(encodedNumber),
);

const booleanStringCodec = DDataStructure.createCodec(
	DDataStructure.TheBoolean,
	(data): data is string => data === "true" || data === "false",
	(boolean) => boolean.toString(),
	(encodedBoolean) => encodedBoolean === "true",
);

// Le mapper conserve les noms des codecs et leurs types précis.
const codecs = DDataStructure.createCodecs({
	number: numberStringCodec,
	boolean: booleanStringCodec,
});

type _CheckCodecs = DCommon.ExpectType<
	typeof codecs,
	DDataStructure.Codecs<{
		number: typeof numberStringCodec;
		boolean: typeof booleanStringCodec;
	}>,
	"strict"
>;

// Le contexte mémorisé permet de retrouver un codec à partir du type fondamental.
const numberCodecFromContext = codecs.context.value.get(DDataStructure.TheNumber);
const booleanCodecFromContext = codecs.context.value.get(DDataStructure.TheBoolean);

// `EncodedValue` applique le contexte aux valeurs qui correspondent à un codec.
type _CheckEncodedNumber = DCommon.ExpectType<
	DDataStructure.EncodedValue<number, typeof codecs>,
	string,
	"strict"
>;
type _CheckEncodedBoolean = DCommon.ExpectType<
	DDataStructure.EncodedValue<boolean, typeof codecs>,
	string,
	"strict"
>;

// Une valeur sans codec associé conserve sa représentation d’origine.
type _CheckUnencodedNull = DCommon.ExpectType<
	DDataStructure.EncodedValue<null, typeof codecs>,
	null,
	"strict"
>;

// Le même contexte peut être fourni à une structure pour encoder et décoder
// plusieurs types fondamentaux avec leurs codecs respectifs.
const structure = DDataStructure.object({
	amount: DDataStructure.number(),
	active: DDataStructure.boolean(),
});
const encoded = structure.encode(codecs, {
	amount: 12.5,
	active: true,
});
const decoded = structure.decode(codecs, {
	amount: "12.5",
	active: "true",
});

// Le retour est un `Either` : la branche de droite contient la valeur encodée,
// tandis que les branches de gauche décrivent une erreur asynchrone ou métier.
type _CheckEncodedResult = DCommon.ExpectType<
	typeof encoded,
	| DEither.Right<
		"encode-success",
		{
			readonly amount: string;
			readonly active: string;
		}
	>
	| DEither.Left<"async-error", DDataStructure.ErrorPromise>
	| DEither.Left<"encode-error", DDataStructure.Error>,
	"strict"
>;

type _CheckDecodedResult = DCommon.ExpectType<
	typeof decoded,
	| DEither.Right<
		"decode-success",
		{
			readonly amount: number;
			readonly active: boolean;
		}
	>
	| DEither.Left<"async-error", DDataStructure.ErrorPromise>
	| DEither.Left<"decode-error", DDataStructure.Error>,
	"strict"
>;

// Après extraction de la branche de succès, les codecs sont visibles dans
// le type de sortie : les deux propriétés externes sont des chaînes.
const encodedValue = DCommon.pipe(
	encoded,
	DEither.unwrapByInformationOrThrow("encode-success"),
);
type _CheckEncodedValue = DCommon.ExpectType<
	typeof encodedValue,
	{
		readonly amount: string;
		readonly active: string;
	},
	"strict"
>;

// Le décodage reconstruit le type interne de la structure.
const decodedValue = DCommon.pipe(
	decoded,
	DEither.unwrapByInformationOrThrow("decode-success"),
);
type _CheckDecodedValue = DCommon.ExpectType<
	typeof decodedValue,
	{
		readonly amount: number;
		readonly active: boolean;
	},
	"strict"
>;
