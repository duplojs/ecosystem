/**
 * @title DString.extract
 *
 * Extraire la première occurrence d'un motif avec ses groupes et sa position.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

const result = DString.extract("order-42", /(?<kind>order)-(?<id>\d+)/);
// Le résultat contient la correspondance, les groupes, les groupes nommés, la position et la chaîne source.
type _CheckResult = DCommon.ExpectType<typeof result, DString.ExtractOutput<"order-42"> | undefined, "strict">;

const piped = DCommon.pipe(
	"order-42",
	DString.extract(/\d+/),
);
// La forme curifiée recherche le même motif sur la chaîne reçue par le pipe.
type _CheckPiped = DCommon.ExpectType<typeof piped, DString.ExtractOutput<"order-42"> | undefined, "strict">;
