/**
 * @title Changement de représentation avec des codecs.
 *
 * Encoder et décoder les données avec un même contrat, selon leur type fondamental.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DString from "@duplojs/lang/string";

// Un codec fait transiter les données entre deux représentations d’une même structure.
// encode convertit la représentation interne vers l’externe ; decode effectue l’inverse.
// Le contexte associe les codecs aux types fondamentaux pendant le parcours de la structure.

// Les `FundamentalType` représentent les familles fondamentales de données.
//
// Par exemple :
// `number()` utilise `TheNumber`.
// `string()` utilise `TheString`.
// `bigint()` utilise `TheBigint`.
//
// Le codec utilise ce `FundamentalType` comme repère pour savoir
// quelles valeurs il doit transformer.

// Codec : number <-> string
const numberStringCodec = DDataStructure.createCodec(
	DDataStructure.TheNumber,

	// Décrit la représentation externe acceptée par le codec.
	(data) => (
		typeof data === "string"
		&& DString.isNumber(data)
	),

	// encode : number -> string
	DString.to,

	// decode : string -> number
	(data) => Number(data),
);

// Les codecs sont regroupés dans un contexte.
// Un `FundamentalType` ne peut avoir qu'un seul codec dans ce contexte.
const codecs = DDataStructure.createCodecs({
	number: numberStringCodec,
});

// Une seule structure décrit la donnée.
// Les codecs vont modifier sa représentation sans nécessiter
// de créer une seconde structure pour la forme encodée.
const productStructure = DDataStructure.object({
	name: DDataStructure.string(),
	price: DDataStructure.number(),
	quantity: DDataStructure.number([
		DDataStructure.integer(),
		DDataStructure.positive(),
	]),
});

// DEither.Right<
//     "encode-success",
//     {
//         readonly name: string;
//         readonly price: string & DString.Number;
//         readonly quantity: string & DString.Number;
//     }
// >
// | DEither.Left<"async-error", DDataStructure.ErrorPromise>
// | DEither.Left<"encode-error", DDataStructure.Error>
const encodedProduct = productStructure.encode(
	codecs,
	{
		name: "Keyboard",
		price: 99.9,
		quantity: 2,
	},
);

// Pendant l'encode, la structure est parcourue.
//
// `name` utilise `TheString`.
// Aucun codec n'est enregistré pour `TheString`, la valeur reste inchangée.
//
// `price` et `quantity` utilisent `TheNumber`.
// Le codec associé à `TheNumber` transforme donc automatiquement
// leurs valeurs de `number` vers `string`.

// DEither.Right<
//     "decode-success",
//     {
//         readonly name: string;
//         readonly price: number;
//         readonly quantity: number & DNumber.Integer & DNumber.Positive;
//     }
// >
// | DEither.Left<"async-error", DDataStructure.ErrorPromise>
// | DEither.Left<"decode-error", DDataStructure.Error>
const decodedProduct = productStructure.decode(
	codecs,
	{
		name: "Keyboard",
		price: "99.9",
		quantity: "2",
	},
);

// Le decode parcourt exactement la même structure dans le sens inverse.
//
// Le codec retrouve les valeurs associées à `TheNumber`, vérifie que
// leur représentation externe est valide, puis les transforme en `number`.
//
// Les contraintes de la structure sont ensuite toujours appliquées.
// `"2"` devient donc `2`, puis `integer()` et `positive()` sont vérifiés.

// Ce principe permet de définir différents systèmes de représentation
// sans modifier les structures métier.
//
// `codecsString` applique ce principe pour représenter les types
// fondamentaux sous forme de chaînes de caractères.
//
// `codecsJson` applique le même principe aux types qui ne possèdent pas
// naturellement de représentation JSON, notamment :
//
// bigint -> string
// date   -> string
// time   -> string

const stringEncodedProduct = productStructure.encode(
	DDataStructure.codecsString,
	{
		name: "Keyboard",
		price: 99.9,
		quantity: 2,
	},
);

// Le principe reste toujours le même :
//
//        état interne
//             |
//           encode
//             |
//             v
//        état externe
//             |
//           decode
//             |
//             v
//        état interne
//
// La `DataStructure` définit la forme de la donnée.
// Le `FundamentalType` identifie la famille de valeur.
// Le `Codec` définit comment cette famille transite entre les deux états.
