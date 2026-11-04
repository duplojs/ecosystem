/**
 * @title DString.extractAll
 *
 * Produire les occurrences d'un motif global sous forme de génératrice.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.extractAll("order-42/order-43", /order-\d+/g);
// La génératrice produit un objet d'extraction pour chaque occurrence.
type _CheckResult = DCommon.ExpectType<typeof result, Generator<DString.ExtractOutput<"order-42/order-43">>, "strict">;

const piped = DCommon.pipe(
	"order-42/order-43",
	DString.extractAll(/order-\d+/g),
);
// La forme curifiée conserve le type de la chaîne d'origine dans chaque extraction.
type _CheckPiped = DCommon.ExpectType<typeof piped, Generator<DString.ExtractOutput<"order-42/order-43">>, "strict">;
