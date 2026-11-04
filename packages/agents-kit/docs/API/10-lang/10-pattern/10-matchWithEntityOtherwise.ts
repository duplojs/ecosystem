/**
 * @title DPattern.matchWithEntityOtherwise
 *
 * Router les entités sélectionnées et conserver dans le type du fallback les entités restantes.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface User extends DModeling.Entity<"User"> {
	id: string;
	name: string;
}
interface Admin extends DModeling.Entity<"Admin"> {
	id: string;
	permissions: readonly string[];
}
interface Guest extends DModeling.Entity<"Guest"> { id: string }
declare const account: User | Admin | Guest;

// Appel direct : traiter certains noms ; le repli reçoit uniquement le reste.
const result = DPattern.matchWithEntityOtherwise(
	account,
	{
		User: (entity) => {
			type _CheckValue = DCommon.ExpectType<typeof entity, User, "strict">;
			return entity.name;
		},
	},
	(entity) => {
		type _CheckRemaining = DCommon.ExpectType<typeof entity, Admin | Guest, "strict">;
		return entity.id;
	},
);
// User produit son résultat ; les autres variantes fournissent leur id.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;

// Appel curifié dans un pipe : le repli conserve le même affinement.
const piped = DCommon.pipe(
	account,
	DPattern.matchWithEntityOtherwise(
		{
			User: (entity) => {
				type _CheckValue = DCommon.ExpectType<typeof entity, User, "strict">;
				return entity.name;
			},
		},
		(entity) => {
			type _CheckRemaining = DCommon.ExpectType<typeof entity, Admin | Guest, "strict">;
			return entity.id;
		},
	),
);
// User produit son résultat ; les autres variantes fournissent leur id.
type _CheckPiped = DCommon.ExpectType<typeof piped, string, "strict">;
